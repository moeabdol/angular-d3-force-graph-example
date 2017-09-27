import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  ngOnInit() {
    console.log('d3.js version:', d3['version']);

    this.forceGraph();
  }

  forceGraph() {
    const width = 800;
    const height = 600;
    const nodes = [{}, {}, {}, {}, {}];

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);

    function ticked() {
      const u = d3.select('#force-graph')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 5)
        .attr('cx', (d) => d['x'])
        .attr('cy', (d) => d['y'])
        .exit()
        .remove();
    }
  }
}
