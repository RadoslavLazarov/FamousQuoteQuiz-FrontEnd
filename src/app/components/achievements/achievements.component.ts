import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

import { AchievementService } from '../../services/achievement.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {
  displayedColumns: string[] = ['questionText', 'answerText', 'isCorrect'];
  dataSource$: any;
  loading = false;

  constructor(private achievementService: AchievementService ) { }

  getAchevements(): void {
    this.loading = true;

    this.dataSource$ = this.achievementService.getAchevements().pipe(tap(() => {
      this.loading = false;
    }));;
  }

  ngOnInit(): void {
    this.getAchevements();
  }
}
