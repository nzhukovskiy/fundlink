import { Component, inject, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Startup } from '../../../data/models/startup';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationType } from '../../../constants/notification-type';

@Component({
  selector: 'app-financial-stats',
  templateUrl: './financial-stats.component.html',
  styleUrls: ['./financial-stats.component.scss']
})
export class FinancialStatsComponent implements OnInit {

    readonly startup = inject<Startup>(MAT_DIALOG_DATA);

    public lineChartData: ChartConfiguration<'line'>['data'] = {
        datasets: [],
        labels: ['1 год', '2 год', '3 год', '4 год', '5 год'],
    };

    public lineChartOptions: ChartConfiguration['options'] = {
        elements: {
            line: {
                tension: 0.5,
            },
        },
        scales: {
            y: {
                position: 'left',
            },
            // y1: {
            //     position: 'right',
            //     grid: {
            //         color: 'rgba(255,0,0,0.3)',
            //     },
            //     ticks: {
            //         color: 'red',
            //     },
            // },
        },

        plugins: {
            legend: { display: true },
        },
    };


    ngOnInit(): void {
        this.lineChartData?.datasets.push({
            data: this.startup!.revenuePerYear.map(x => x),
            label: "Прибыль до вычета процентов и налогов"
        })
        this.lineChartData?.datasets.push({
            data: this.startup!.capitalExpenditures.map(x => x),
            label: "Вложения в основные средства компании"
        })
        this.lineChartData?.datasets.push({
            data: this.startup!.changesInWorkingCapital.map(x => x),
            label: "Изменения в оборотном капитале"
        })
        this.lineChartData?.datasets.push({
            data: this.startup!.deprecationAndAmortization.map(x => x),
            label: "Амортизационные расходы"
        })
    }


    protected readonly NotificationType = NotificationType;
}
