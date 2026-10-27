
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { AssetentryService } from '../../services/assetentry.service';
import type { Asset as ApiAsset } from '../../services/assetentry.service';
import { environment } from '../../../environments/environment';
import { AssetHistoryService,type AssetHistory} from '../../services/asset-history.service';



interface AssetCard {
  assetId: string;
  image: string;
  name: string;
  category: string;
  brand: string;
  department: string;
  cost: number;
  bookValue: number;
  holder: string;
  status: string;
}

@Component({
  selector: 'app-asset-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asset-entry.html',
  styleUrl: './asset-entry.scss'
})
export class AssetEntry implements OnInit, OnDestroy {

  // =========================================
  // LIFECYCLE AND REFERENCES
  // =========================================

  private readonly destroy$ = new Subject<void>();

  @ViewChild('imageInput')
  imageInput?: ElementRef<HTMLInputElement>;

  @ViewChild('excelFileInput')
  excelFileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private readonly assetService: AssetentryService,
    private readonly cdr: ChangeDetectorRef,
     private readonly assetHistoryService: AssetHistoryService,
  ) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByAssetId(index: number, asset: AssetCard): string {
    return asset.assetId || `asset-${index}`;
  }

  // =========================================
  // ASSET COLLECTION AND LOADING STATES
  // =========================================

  assets: AssetCard[] = [];
  filteredAssets: AssetCard[] = [];

  loading = false;
  isLoading = false;
  isSaving = false;
  isDeleting = false;
  isImporting = false;

  pageError = '';
  errorMessage = '';
  successMessage = '';
  formError = '';

  // =========================================
  // SEARCH AND FILTER
  // =========================================

  searchText = '';
  selectedStatus = 'All';

  // =========================================
  // ASSET FORM
  // =========================================

  showAssetForm = false;

  assetName = '';
  category = '';
  brand = '';
  department = '';

  cost: number | null = null;
  bookValue: number | null = null;

  holder = '';
  status = '';

  selectedImage = '';
  selectedImageFile: File | null = null;

  // =========================================
  // EDIT MODE
  // =========================================

  isEditMode = false;
  editingAssetId: string | null = null;

  // =========================================
  // SUMMARY COUNTS
  // =========================================

  get totalAssets(): number {
    return this.assets.length;
  }

  get assignedAssets(): number {
    return this.assets.filter(
      asset => asset.status.trim().toLowerCase() === 'assigned'
    ).length;
  }

  get availableAssets(): number {
    return this.assets.filter(
      asset => asset.status.trim().toLowerCase() === 'available'
    ).length;
  }

  get maintenanceAssets(): number {
    return this.assets.filter(
      asset => asset.status.trim().toLowerCase() === 'maintenance'
    ).length;
  }

  // =========================================
  // LOAD ALL ASSETS
  // GET /api/Asset/GetAllAssets
  // =========================================

  loadAssets(preserveMessages = false): void {
    this.loading = true;
    this.isLoading = true;

    if (!preserveMessages) {
      this.pageError = '';
      this.errorMessage = '';
    }

    // Notify Angular that loading has started.
    this.cdr.markForCheck();

    this.assetService.getAllAssets()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.isLoading = false;

          // Refresh the view after loading completes.
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: response => {
          console.log('GetAllAssets API response:', response);

          const apiAssets = this.extractAssetArray(response);

          this.assets = apiAssets.map(item =>
            this.mapApiAssetToCard(item)
          );

          this.applyFilters();

          console.log('Assets loaded:', this.assets.length);
          console.log('Cards to display:', this.filteredAssets.length);

          // Notify Angular that the card collection has changed.
          this.cdr.markForCheck();
        },

        error: error => {
          console.error('Failed to load assets:', error);

          this.pageError =
            error?.error?.Message ??
            error?.error?.message ??
            error?.message ??
            'Unable to load assets. Check whether the API is running.';

          // Keep existing cards if refreshing fails.
          this.cdr.markForCheck();
        }
      });
  }

  // =========================================
  // EXTRACT ARRAY FROM API RESPONSE
  // =========================================

  private extractAssetArray(response: unknown): ApiAsset[] {
    if (Array.isArray(response)) {
      return response as ApiAsset[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const result = response as Record<string, unknown>;

    if (Array.isArray(result['assets'])) {
      return result['assets'] as ApiAsset[];
    }

    if (Array.isArray(result['Assets'])) {
      return result['Assets'] as ApiAsset[];
    }

    if (Array.isArray(result['data'])) {
      return result['data'] as ApiAsset[];
    }

    if (Array.isArray(result['result'])) {
      return result['result'] as ApiAsset[];
    }

    const nestedData = result['data'];

    if (
      nestedData &&
      typeof nestedData === 'object' &&
      !Array.isArray(nestedData)
    ) {
      const nested = nestedData as Record<string, unknown>;

      if (Array.isArray(nested['assets'])) {
        return nested['assets'] as ApiAsset[];
      }

      if (Array.isArray(nested['Assets'])) {
        return nested['Assets'] as ApiAsset[];
      }
    }

    console.warn(
      'GetAllAssets response did not contain a recognized asset array.',
      response
    );

    return [];
  }

  // =========================================
  // MAP API ASSET TO UI CARD
  // =========================================

  private mapApiAssetToCard(
    item: ApiAsset | Record<string, unknown>
  ): AssetCard {
    const data = item as Record<string, unknown>;

    const rawImage = String(
      data['asset_Image'] ??
      data['assetImage'] ??
      data['Asset_Image'] ??
      data['image'] ??
      ''
    );

    return {
      assetId: String(
        data['asset_Id'] ??
        data['assetId'] ??
        data['Asset_Id'] ??
        ''
      ),

      image: this.resolveImageUrl(rawImage),

      name: String(
        data['asset_Name'] ??
        data['assetName'] ??
        data['Asset_Name'] ??
        data['name'] ??
        ''
      ),

      category: String(
        data['category'] ??
        data['Category'] ??
        ''
      ),

      brand: String(
        data['brand'] ??
        data['Brand'] ??
        ''
      ),

      department: String(
        data['department'] ??
        data['Department'] ??
        ''
      ),

      cost: this.toNumber(
        data['cost'] ??
        data['Cost']
      ),

      bookValue: this.toNumber(
        data['book_Value'] ??
        data['bookValue'] ??
        data['Book_Value']
      ),

      holder: String(
        data['holder'] ??
        data['Holder'] ??
        ''
      ),

      status: String(
        data['status'] ??
        data['Status'] ??
        ''
      )
    };
  }

  // =========================================
  // IMAGE URL HANDLING
  // =========================================

  private resolveImageUrl(image: string): string {
    const value = image.trim();

    if (!value) {
      return '';
    }

    if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(value)) {
      return value;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith('/')) {
      const apiOrigin = environment.apiUrl.replace(/\/api\/?$/i, '');
      return `${apiOrigin}${value}`;
    }

    if (/^[A-Za-z0-9+/=\s]+$/.test(value)) {
      return `data:image/jpeg;base64,${value.replace(/\s/g, '')}`;
    }

    console.warn('Unsupported asset image format.');
    return '';
  }

  private toNumber(value: unknown): number {
    const numberValue = Number(value ?? 0);

    return Number.isFinite(numberValue) ? numberValue : 0;
  }

  // =========================================
  // API RESPONSE HELPERS
  // =========================================

  private asRecord(value: unknown): Record<string, unknown> | null {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      return value as Record<string, unknown>;
    }

    return null;
  }

  private getApiMessage(
    response: unknown,
    fallback: string
  ): string {
    const result = this.asRecord(response);

    return String(
      result?.['Message'] ??
      result?.['message'] ??
      result?.['ErrorMessage'] ??
      fallback
    );
  }

  private isApiSuccess(response: unknown): boolean {
    const result = this.asRecord(response);

    if (!result) {
      return true;
    }

    const rawStatus = result['Status'] ?? result['status'];

    if (
      rawStatus === 0 ||
      rawStatus === false ||
      rawStatus === '0' ||
      rawStatus === 'false'
    ) {
      return false;
    }

    if (
      result['success'] === false ||
      result['Success'] === false
    ) {
      return false;
    }

    return true;
  }

  // =========================================
  // OPEN AND CLOSE ASSET FORM
  // =========================================

  addNewAsset(): void {
    if (this.isSaving) {
      return;
    }

    this.resetForm();
    this.isEditMode = false;
    this.showAssetForm = true;
    this.successMessage = '';
    this.pageError = '';
  }

  closeAssetForm(): void {
    if (this.isSaving) {
      return;
    }

    this.showAssetForm = false;
    this.resetForm();
  }

  // =========================================
  // IMAGE SELECTION AND PREVIEW
  // =========================================

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.formError = 'Please select a valid image file.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.formError = 'Image size must not exceed 5 MB.';
      input.value = '';
      return;
    }

    this.formError = '';
    this.selectedImageFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.selectedImage = reader.result;

        console.log('Image type:', file.type);
        console.log(
          'Image URL prefix:',
          this.selectedImage.substring(0, 30)
        );
        console.log(
          'Image data length:',
          this.selectedImage.length
        );

        this.cdr.markForCheck();
      }
    };

    reader.onerror = () => {
      this.formError = 'Unable to read the selected image.';
      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  // =========================================
  // VALIDATE ASSET FORM
  // =========================================

  private validateForm(): boolean {
    this.formError = '';

    if (!this.assetName.trim()) {
      this.formError = 'Asset name is required.';
      return false;
    }

    if (!this.category.trim()) {
      this.formError = 'Category is required.';
      return false;
    }

    if (!this.brand.trim()) {
      this.formError = 'Brand is required.';
      return false;
    }

    if (!this.department.trim()) {
      this.formError = 'Department is required.';
      return false;
    }

    if (
      this.cost === null ||
      !Number.isFinite(this.cost) ||
      this.cost <= 0
    ) {
      this.formError = 'Cost must be greater than zero.';
      return false;
    }

    if (
      this.bookValue === null ||
      !Number.isFinite(this.bookValue) ||
      this.bookValue < 0
    ) {
      this.formError = 'Book value cannot be negative.';
      return false;
    }

    if (this.bookValue > this.cost) {
      this.formError = 'Book value cannot be greater than cost.';
      return false;
    }

    if (!this.status.trim()) {
      this.formError = 'Status is required.';
      return false;
    }

    if (
      this.status.trim().toLowerCase() === 'assigned' &&
      !this.holder.trim()
    ) {
      this.formError = 'Holder is required for an assigned asset.';
      return false;
    }

    return true;
  }

  // =========================================
  // BUILD API REQUEST PAYLOAD
  // =========================================

  private buildAssetPayload(): ApiAsset {
    const payload: ApiAsset = {
      asset_Name: this.assetName.trim(),
      category: this.category.trim(),
      brand: this.brand.trim(),
      department: this.department.trim(),
      cost: Number(this.cost),
      book_Value: Number(this.bookValue),
      holder: this.holder.trim(),
      status: this.status.trim(),
      asset_Image: this.selectedImage || null
    };

    if (this.isEditMode && this.editingAssetId) {
      payload.asset_Id = this.editingAssetId;
    }

    return payload;
  }

  // =========================================
  // SAVE OR UPDATE ASSET
  // POST /api/Asset/SaveAsset
  // POST /api/Asset/UpdateAsset
  // =========================================

  saveAsset(): void {
    if (this.isSaving || !this.validateForm()) {
      return;
    }

    if (this.isEditMode && !this.editingAssetId) {
      this.formError = 'Asset ID is missing. Select the asset again.';
      return;
    }

    const payload = this.buildAssetPayload();
    const updating = this.isEditMode;

    this.isSaving = true;
    this.formError = '';
    this.pageError = '';
    this.successMessage = '';

    const request = updating
      ? this.assetService.updateAsset(payload)
      : this.assetService.saveAsset(payload);

    request
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isSaving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: response => {
          console.log('Save/Update API response:', response);

          if (!this.isApiSuccess(response)) {
            this.formError = this.getApiMessage(
              response,
              updating
                ? 'Unable to update the asset.'
                : 'Unable to save the asset.'
            );

            this.cdr.markForCheck();
            return;
          }

          this.successMessage = this.getApiMessage(
            response,
            updating
              ? 'Asset updated successfully.'
              : 'Asset saved successfully.'
          );

          this.showAssetForm = false;
          this.resetForm();

          this.cdr.markForCheck();

          // Refresh the list but preserve the success message.
          this.loadAssets(true);
        },

        error: error => {
          console.error('Save/Update API error:', error);

          this.formError =
            error?.error?.Message ??
            error?.error?.message ??
            error?.message ??
            'Unable to save the asset. Check the API endpoint and request model.';

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================
  // EDIT ASSET
  // =========================================

  editAsset(asset: AssetCard): void {
    if (this.isSaving) {
      return;
    }

    this.resetForm();

    this.isEditMode = true;
    this.editingAssetId = asset.assetId;

    this.assetName = asset.name;
    this.category = asset.category;
    this.brand = asset.brand;
    this.department = asset.department;
    this.cost = asset.cost;
    this.bookValue = asset.bookValue;
    this.holder = asset.holder;
    this.status = asset.status;
    this.selectedImage = asset.image;

    this.showAssetForm = true;
    this.pageError = '';
    this.successMessage = '';

    this.cdr.markForCheck();
  }

  // =========================================
  // GET ASSET BY ID
  // GET /api/Asset/GetAssetById/{id}
  // =========================================

  getAssetDetails(id: string): void {
    if (!id) {
      this.pageError = 'Asset ID is required.';
      return;
    }

    this.assetService.getAssetById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          const result = this.asRecord(response);

          const nested =
            result?.['data'] ??
            result?.['asset'] ??
            result?.['Asset'];

          const item = (
            nested && typeof nested === 'object'
              ? nested
              : response
          ) as ApiAsset | Record<string, unknown>;

          this.editAsset(this.mapApiAssetToCard(item));
          this.cdr.markForCheck();
        },

        error: error => {
          console.error('Failed to retrieve asset:', error);

          this.pageError =
            error?.error?.Message ??
            error?.error?.message ??
            'Unable to retrieve asset details.';

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================
  // DELETE ASSET
  // GET /api/Asset/DeleteAsset/{id}
  // =========================================

  deleteAsset(asset: AssetCard): void {
    if (this.isDeleting) {
      return;
    }

    if (!asset.assetId) {
      this.pageError = 'Asset ID is missing.';
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${asset.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.pageError = '';
    this.successMessage = '';

    this.assetService.deleteAsset(asset.assetId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isDeleting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: response => {
          console.log('Delete API response:', response);

          if (!this.isApiSuccess(response)) {
            this.pageError = this.getApiMessage(
              response,
              'Unable to delete the asset.'
            );

            this.cdr.markForCheck();
            return;
          }

          this.successMessage = this.getApiMessage(
            response,
            'Asset deleted successfully.'
          );

          this.cdr.markForCheck();

          this.loadAssets(true);
        },

        error: error => {
          console.error('Delete API error:', error);

          this.pageError =
            error?.error?.Message ??
            error?.error?.message ??
            error?.message ??
            'Failed to delete asset. Check the API endpoint.';

          this.cdr.markForCheck();
        }
      });
  }

  // =========================================
  // RESET FORM
  // =========================================

  resetForm(): void {
    this.assetName = '';
    this.category = '';
    this.brand = '';
    this.department = '';

    this.cost = null;
    this.bookValue = null;

    this.holder = '';
    this.status = '';

    this.selectedImage = '';
    this.selectedImageFile = null;

    this.formError = '';
    this.isEditMode = false;
    this.editingAssetId = null;

    if (this.imageInput?.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }

    this.cdr.markForCheck();
  }

  // =========================================
  // SEARCH AND FILTER
  // =========================================

  onSearch(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();
    const selectedStatus = this.selectedStatus.trim().toLowerCase();

    this.filteredAssets = this.assets.filter(asset => {
      const searchableValues = [
        asset.assetId,
        asset.name,
        asset.category,
        asset.brand,
        asset.department,
        asset.holder
      ];

      const matchesSearch = searchableValues.some(value =>
        String(value ?? '').toLowerCase().includes(search)
      );

      const assetStatus = String(asset.status ?? '')
        .trim()
        .toLowerCase();

      const matchesStatus =
        selectedStatus === 'all' ||
        assetStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.cdr.markForCheck();
  }

  
  // =========================================
  // VIEW ASSET HISTORY
  // =========================================

  showHistory = false;
  loadingHistory = false;
  selectedHistoryAsset: AssetCard | null = null;
  assetHistory: AssetHistory[] = [];

  viewHistory(asset: AssetCard): void {
    if (!asset.assetId) {
      this.pageError = 'Asset ID is missing.';
      return;
    }

    // Open the history modal for the selected asset.
    this.selectedHistoryAsset = asset;
    this.showHistory = true;
    this.loadingHistory = true;
    this.assetHistory = [];
    this.pageError = '';
    this.successMessage = '';

    // Call GET /api/AssetHistory/{assetId}.
    this.assetHistoryService
      .getAssetHistory(asset.assetId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingHistory = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: response => {
          this.assetHistory = response?.history ?? [];
          this.cdr.markForCheck();
        },

        error: error => {
          console.error('Failed to load asset history:', error);

          this.pageError =
            error?.error?.Message ??
            error?.error?.message ??
            error?.message ??
            'Unable to load asset history.';

          this.cdr.markForCheck();
        }
      });
  }

  closeHistory(): void {
    this.showHistory = false;
    this.selectedHistoryAsset = null;
    this.assetHistory = [];
    this.pageError = '';
    this.cdr.markForCheck();
  }


  // =========================================
  // OPEN EXCEL FILE PICKER
  // =========================================

  importExcel(): void {
    if (this.isImporting) {
      return;
    }

    this.excelFileInput?.nativeElement.click();
  }

  // =========================================
  // HANDLE EXCEL IMPORT FROM HTML INPUT
  // =========================================

  handleExcelImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const validExtension = /\.(xlsx|xls|csv)$/i.test(file.name);

    if (!validExtension) {
      this.pageError = 'Please select an XLSX, XLS, or CSV file.';
      input.value = '';
      this.cdr.markForCheck();
      return;
    }

    this.isImporting = true;
    this.pageError = '';
    this.successMessage = '';

    const reader = new FileReader();

    reader.onload = () => {
      try {
        if (!(reader.result instanceof ArrayBuffer)) {
          this.pageError = 'Unable to read the selected file.';
          return;
        }

        const workbook = XLSX.read(reader.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          this.pageError = 'The Excel file contains no worksheets.';
          return;
        }

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: '' }
        );

        if (rows.length === 0) {
          this.pageError = 'The selected file contains no asset records.';
          return;
        }

        const importedAssets: AssetCard[] = rows
          .map((row, index): AssetCard | null => {
            const name = String(
              row['Asset_Name'] ??
              row['Asset Name'] ??
              row['asset_Name'] ??
              ''
            ).trim();

            if (!name) {
              return null;
            }

            return {
              assetId: String(
                row['Asset_Id'] ??
                row['Asset ID'] ??
                row['asset_Id'] ??
                `IMPORT-${index + 1}`
              ),

              image: '',
              name,

              category: String(
                row['Category'] ??
                row['category'] ??
                ''
              ).trim(),

              brand: String(
                row['Brand'] ??
                row['brand'] ??
                ''
              ).trim(),

              department: String(
                row['Department'] ??
                row['department'] ??
                ''
              ).trim(),

              cost: this.toNumber(
                row['Cost'] ??
                row['cost']
              ),

              bookValue: this.toNumber(
                row['Book_Value'] ??
                row['Book Value'] ??
                row['book_Value']
              ),

              holder: String(
                row['Holder'] ??
                row['holder'] ??
                ''
              ).trim(),

              status: String(
                row['Status'] ??
                row['status'] ??
                'Available'
              ).trim()
            };
          })
          .filter(
            (asset): asset is AssetCard => asset !== null
          );

        if (importedAssets.length === 0) {
          this.pageError =
            'No valid assets found. Check that the file has an Asset_Name or Asset Name column.';
          return;
        }

        // UI-only import. This does not save rows to SQL/API.
        this.assets = [...this.assets, ...importedAssets];
        this.applyFilters();

        this.successMessage =
          `${importedAssets.length} asset(s) imported into the UI.`;
      } catch (error) {
        console.error('Excel import failed:', error);

        this.pageError =
          'Unable to import the file. Check that the file format is valid.';
      } finally {
        this.isImporting = false;
        input.value = '';
        this.cdr.markForCheck();
      }
    };

    reader.onerror = () => {
      this.pageError = 'Failed to read the selected file.';
      this.isImporting = false;
      input.value = '';
      this.cdr.markForCheck();
    };

    reader.readAsArrayBuffer(file);
  }

  // =========================================
  // PRINT ASSETS
  // =========================================

  printAssets(): void {
    window.print();
  }

  // =========================================
  // EXPORT PDF
  // =========================================

  exportPdf(): void {
    if (this.filteredAssets.length === 0) {
      this.pageError = 'No assets available to export.';
      this.cdr.markForCheck();
      return;
    }

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    pdf.setFontSize(16);
    pdf.text('Isuzu Asset Management - Asset Report', 14, 15);

    pdf.setFontSize(10);
    pdf.text(
      `Total Assets: ${this.filteredAssets.length}`,
      14,
      22
    );

    const tableData = this.filteredAssets.map(asset => [
      asset.assetId || '-',
      asset.name,
      asset.category,
      asset.brand,
      asset.department,
      asset.cost.toString(),
      asset.bookValue.toString(),
      asset.holder || '-',
      asset.status || '-'
    ]);

    autoTable(pdf, {
      startY: 28,
      head: [[
        'Asset ID',
        'Asset Name',
        'Category',
        'Brand',
        'Department',
        'Cost',
        'Book Value',
        'Holder',
        'Status'
      ]],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fontSize: 8
      }
    });

    pdf.save('isuzu-asset-report.pdf');
  }

  // =========================================
  // EXPORT EXCEL
  // =========================================

  exportExcel(): void {
    if (this.filteredAssets.length === 0) {
      this.pageError = 'No assets available to export.';
      this.cdr.markForCheck();
      return;
    }

    const exportData = this.filteredAssets.map(asset => ({
      'Asset ID': asset.assetId,
      'Asset Name': asset.name,
      'Category': asset.category,
      'Brand': asset.brand,
      'Department': asset.department,
      'Cost': asset.cost,
      'Book Value': asset.bookValue,
      'Holder': asset.holder,
      'Status': asset.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet['!cols'] = [
      { wch: 16 },
      { wch: 25 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 14 },
      { wch: 14 },
      { wch: 20 },
      { wch: 16 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Assets'
    );

    XLSX.writeFile(
      workbook,
      'isuzu-asset-report.xlsx'
    );
  }

  // =========================================
  // STATUS CSS CLASS
  // =========================================

  getStatusClass(status: string): string {
    switch (String(status ?? '').trim().toLowerCase()) {
      case 'new':
        return 'status-new';

      case 'assigned':
        return 'status-assigned';

      case 'available':
        return 'status-available';

      case 'maintenance':
        return 'status-maintenance';

      case 'disposed':
        return 'status-disposed';

      case 'returned':
        return 'status-returned';

      default:
        return 'status-default';
    }
  }
}
