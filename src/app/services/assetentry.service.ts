
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Asset {
  asset_Id?: string;
  asset_Name: string;
  category: string;
  brand: string;
  department: string;
  cost: number;
  book_Value: number;
  holder: string;
  status: string;
  asset_Image?: string | null;
}

export interface AssetApiResponse {
  success?: boolean;
  message?: string;
  data?: Asset | Asset[];
  assets?: Asset[];
}

@Injectable({
  providedIn: 'root'
})
export class AssetentryService {
  private readonly apiUrl = `${environment.apiUrl}/Asset`;

  constructor(private readonly http: HttpClient) {}

  // GET ALL ASSETS
  getAllAssets(): Observable<Asset[] | AssetApiResponse> {
    return this.http.get<Asset[] | AssetApiResponse>(
      `${this.apiUrl}/GetAllAssets`
    );
  }

  // GET ASSET BY ID
  getAssetById(id: string): Observable<Asset | AssetApiResponse> {
    return this.http.get<Asset | AssetApiResponse>(
      `${this.apiUrl}/GetAssetById/${encodeURIComponent(id)}`
    );
  }

  // SAVE ASSET
  // POST /api/Asset/SaveAsset
  saveAsset(asset: Asset): Observable<unknown> {
    return this.http.post<unknown>(
      `${this.apiUrl}/SaveAsset`,
      asset
    );
  }

  // UPDATE ASSET
  // POST /api/Asset/UpdateAsset
  updateAsset(asset: Asset): Observable<unknown> {
    return this.http.post<unknown>(
      `${this.apiUrl}/UpdateAsset`,
      asset
    );
  }

  // DELETE ASSET
  // GET /api/Asset/DeleteAsset/{id}
  deleteAsset(id: string): Observable<unknown> {
    return this.http.get<unknown>(
      `${this.apiUrl}/DeleteAsset/${encodeURIComponent(id)}`
    );
  }
}
