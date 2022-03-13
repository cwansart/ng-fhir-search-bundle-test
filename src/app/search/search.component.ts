import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Bundle } from 'fhir/r4';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent  {

  ageFrom?: number;

  ageTo?: number;

  deceased = false;

  notDeceased = false;

  constructor(private readonly http: HttpClient) { }

  saveQuery() {
    const body: Bundle = {
      resourceType: "Bundle",
      type: 'collection',
      entry: []
    }

    if (this.ageFrom && this.ageTo) {
      body.entry?.push({
        resource: {
          resourceType: 'CodeSystem',
          status : "active",
          content : "complete",
          concept: [
            {
              code: `P${this.ageFrom}Y--P${this.ageTo}Y`,
              display: `${this.ageFrom} to ${this.ageTo} years`,
              definition: `Age range from ${this.ageFrom} to ${this.ageTo} years`
            }
          ]
        }
      })
    }

    if (this.deceased || this.notDeceased) {
      body.entry?.push({
        resource: {
          resourceType: 'Patient',
          deceasedBoolean: this.deceased,
        }
      })
    }

    this.http.post<Bundle>("http://localhost:8888/fhir/Bundle", body, {
      headers: new HttpHeaders({
        "Content-Type": "application/fhir+json; charset=UTF-8",
      })
    }).subscribe()
  }
}
