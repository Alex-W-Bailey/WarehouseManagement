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

    public addTrailer(companyId) {
        return this.httpClient.get(`http://54.235.248.192/fs_api/trailerWebServices/addTrailerRecord.php?company_id=${companyId}`);
    }

    public addPicture(data) {
        // return this.httpClient.get(`http://54.235.248.192/fs_api/trailerWebServices/addImageBase64.php?house_id=${houseId}&ImageBase64=${base64}`);

        console.log(data);

        this.nativeHttp.setDataSerializer("json");
        return this.nativeHttp.sendRequest(`http://54.235.248.192/fs_api/trailerWebServices/addImageBase64.php`,
            {
                method: 'post',
                data: data,
            }
        );
    }
} 