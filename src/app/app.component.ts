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

    // this.simpleForceGraph();
    this.forceGraph();
  }

  simpleForceGraph() {
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

  forceGraph() {
    const graph = {
      nodes: [
        { name: 'Mohammad', age: 35 },
        { name: 'Khalid', age: 34 },
        { name: 'Abdelgadir', age: 36 },
        { name: 'Anwar', age: 37 },
        { name: 'Ahmed', age: 38 },
        { name: 'Haifa', age: 39 },
      ],
      links: [
        { source: 'Mohammad', target: 'Abdelgadir' },
        { source: 'Mohammad', target: 'Khalid' },
        { source: 'Khalid', target: 'Anwar' },
        { source: 'Khalid', target: 'Ahmed' },
        { source: 'Anwar', target: 'Ahmed' },
        { source: 'Khalid', target: 'Haifa' },
      ]
    };

    const canvas: any = d3.select('#network');
    const r = 20;
    const width = canvas.attr('width');
    const height = canvas.attr('height');
    const context = canvas.node().getContext('2d');

    const simulation = d3.forceSimulation()
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('collide', d3.forceCollide(r + 5))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('link', d3.forceLink()
        .id((d) => d['name']))
      .on('tick', update);

    simulation.nodes(graph.nodes);
    simulation.force<d3.ForceLink<any, any>>('link').links(graph.links);

    canvas
      .call(d3.drag()
        .container(canvas.node())
        .subject(dragsubject)
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    function update() {
      context.clearRect(0, 0, width, height);

      context.beginPath();
      graph.nodes.forEach(drawNode);
      context.fill();

      context.beginPath();
      graph.links.forEach(drawLink);
      context.stroke();
    }

    function dragsubject() {
      return simulation.find(d3.event.x, d3.event.y);
    }

    function dragstarted() {
      if (!d3.event.active) { simulation.alphaTarget(0.3).restart(); }
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) { simulation.alphaTarget(0); }
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    function drawNode(d) {
      context.moveTo(d.x, d.y);
      context.arc(d.x, d.y, r, 0, 2 * Math.PI);
    }

    function drawLink(l) {
      context.moveTo(l.source.x, l.source.y);
      context.lineTo(l.target.x, l.target.y);
    }

    update();
  }
}
