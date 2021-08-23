import got, { Response } from 'got/dist/source';

import { Injectable } from '@nestjs/common';
import { SignupResponse } from '../user.interface';

@Injectable()
export class UserDBService {
  url: string;
  teacherPartUrl: string;
  schoolPartUrl: string;

  constructor() {
    this.url = process.env.ESAMWAD_BACKEND_BASE_URL;
    this.teacherPartUrl = process.env.ES_TEACHER_PART;
    this.schoolPartUrl = process.env.ES_SCHOOL_PART;
  }

  persist(dbObj: any): Promise<{ status: boolean; errors: any }> {
    return got
      .post(this.url + this.teacherPartUrl, { json: dbObj })
      .then((resp: Response): { status: boolean; errors: any } => {
        if (resp.statusCode === 201) {
          return {
            status: true,
            errors: null,
          };
        } else {
          return {
            status: false,
            errors: resp.body,
          };
        }
      })
      .catch((e): { status: boolean; errors: string } => {
        console.log(e.response.body);
        return {
          status: false,
          errors: e.response.body,
        };
      });
  }

  getUserById(id: string): Promise<any> {
    const url = this.url + this.teacherPartUrl + `?user_id=${id}`;
    return got.get(url).json();
  }

  update(user: any): Promise<any> | any {
    return Promise.resolve({});
  }

  getSchool(udise: string): Promise<any> {
    const url = this.url + this.schoolPartUrl + `?udise=${udise}`;
    return got
      .get(url)
      .then((response: Response): any => {
        const body = JSON.parse(response.body + '');
        if (response.statusCode === 200 && body.count > 0) {
          return {
            status: true,
            id: body.results[0].id,
          };
        } else {
          return {
            status: false,
            id: null,
          };
        }
      })
      .catch((e) => {
        console.log(e);
        return {
          status: false,
          id: null,
        };
      });
  }
}
