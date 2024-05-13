import { HttpParams } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

export const getParams = (filter?: any, paginator?: MatPaginator, sort?: MatSort): HttpParams => {
  let params = new HttpParams();
  if (filter) {
    Object.keys(filter).forEach(key => {
      const value = filter[key];
      if (value) {
        params = params.set(key, value);
      }
    });
  }
  if (sort?.direction) {
    let orderBy;
    if(sort.active == 'balanceDate'){
      orderBy = 'expireDate';
    } else {
      orderBy = sort.active;
    }
    if (sort.direction === 'desc') {
      orderBy += ',desc';
    }
    params = params.set('sort', orderBy);
  }
  if (paginator) {
    if (paginator.pageIndex > 0) {
      params = params.set('page', paginator.pageIndex);
    }
    if (paginator.pageSize > 0) {
      params = params.set('size', paginator.pageSize);
    }
  }
  return params;
};
