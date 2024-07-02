import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

export const ngbDateFormat = (dateStruct: NgbDateStruct): Date => {
  return new Date(Date.UTC(dateStruct.year, dateStruct.month - 1, dateStruct.day));
};
