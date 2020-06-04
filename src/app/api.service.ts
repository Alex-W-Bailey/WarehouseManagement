import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx'

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private httpClient: HttpClient, private nativeHttp: HTTP) { }

    public attemptLogin(user, pass) {
        return this.httpClient.get(`https://freightsnap-proto.herokuapp.com/login/${user}/${pass}`);
    }

    public addTrailer(companyId, orderId) {
        return this.httpClient.get(`http://54.235.248.192/fs_api/trailerWebServices/addTrailerRecord.php?company_id=${companyId}&order_id=${orderId}`);
    }

    public addPicture(houseId, img) {
        console.log("API");
        console.log(houseId);
        console.log(img);

        return this.nativeHttp.sendRequest(`http://54.235.248.192/fs_api/trailerWebServices/addImageBase64.php`,
            {
                method: 'post',
                data: {
                    house_id: houseId,
                    ImageBase64: img
                }
            }
        );
    }
} 