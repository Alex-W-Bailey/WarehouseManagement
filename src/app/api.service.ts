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
        this.nativeHttp.setDataSerializer("json");
        return this.nativeHttp.sendRequest(`https://freightsnap-proto.herokuapp.com/newTerminal`, 
            {
                method: 'post',
                data: { company_id: companyId }
            }
        );
    }
} 