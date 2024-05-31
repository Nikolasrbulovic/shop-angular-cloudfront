import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { map, switchMap } from 'rxjs/operators';

const authorizationToken = 'Tmlrb2xhc3JidWxvdmljPVRFU1RfUEFTU1dPUkQK';
@Injectable()
export class ManageProductsService extends ApiService {
  uploadProductsCSV(file: File): Observable<unknown> {
    console.log('test2');
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    if (!authorizationToken) {
      console.error('Authorization token not found in localStorage');
      return EMPTY;
    }
    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) => {
        return this.http.put(url, file, {
          headers: {
            Authorization: `Basic ${authorizationToken}`,
            'Content-Type': 'text/csv',
          },
        });
      }),
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    const url = this.getUrl('import', 'import');
    if (!authorizationToken) {
      console.error('Authorization token not found in localStorage');
      return EMPTY;
    }
    return this.http
      .get<{ url: string }>(url, {
        params: {
          name: fileName,
        },
        headers: {
          Authorization: `Basic ${authorizationToken}`,
        },
      })
      .pipe(map((response) => response.url));
  }
}
