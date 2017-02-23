import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';

import { KpisService } from '@services/kpis.service';
import { PreguntasService } from '@services/preguntas.service';
import { RespuestasService } from '@services/respuestas.service';
import { StaffService } from '@services/staff.service';

import * as ACTIONS from '@actions/branch.types';

import {
  ErrorCloseAnswer, ErrorCloseQuestion, ErrorHistoric, ErrorKPI, ErrorOpenAnswer,
  ErrorOpenQuestion, ErrorStaffRanking, SuccessCloseAnswer, SuccessCloseQuestion,
  SuccessHistoric, SuccessKPI, SuccessOpenAnswer, SuccessOpenQuestion, SuccessStaffRanking,
} from '@actions/branch.actions';

@Injectable()
export class BranchEffects {
  constructor(private actions$: Actions,
    private kpiService: KpisService,
    private preguntasService: PreguntasService,
    private respuestasService: RespuestasService,
    private staffService: StaffService) { }
}
