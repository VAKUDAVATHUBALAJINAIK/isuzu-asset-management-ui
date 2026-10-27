
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AssetHistory {
  history_Id: number;
  asset_Id: string;
  action: string;
  previous_Status: string | null;
  new_Status: string | null;
  field_Name: string | null;
  old_Value: string | null;
  new_Value: string | null;
  details: string | null;
  performed_By: string | null;
  created_At: string;
}

export interface AssetHistoryResponse {
  assetId: string;
  totalRecords: number;
  history: AssetHistory[];
}

@Injectable({
  providedIn: 'root'
})
export class AssetHistoryService {
  private readonly apiUrl =
    `${environment.apiUrl}/AssetHistory`;

  constructor(private readonly http: HttpClient) {}

  getAssetHistory(
    assetId: string
  ): Observable<AssetHistoryResponse> {
    return this.http.get<AssetHistoryResponse>(
      `${this.apiUrl}/${encodeURIComponent(assetId)}`
    );
  }
}
