const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector('ul');

    if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'row';
        listContainer.style.margin = 0;
        listContainer.style.padding = 0;
        listContainer.style.justifyContent = 'space-between';
        legendContainer.appendChild(listContainer);
    }

    return listContainer;
};

const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
            ul.firstChild.remove();
        }

        ul.style.fontSize = '.8rem';
        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach(item => {
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';
            li.style.marginLeft = '10px';

            li.onclick = () => {
                const { type } = chart.config;
                if (type === 'pie' || type === 'doughnut') {
                    // Pie and doughnut charts only have a single dataset and visibility is per item
                    chart.toggleDataVisibility(item.index);
                } else {
                    chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                }
                chart.update();
            };

            // Color box
            const boxSpan = document.createElement('span');
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.borderColor = item.strokeStyle;
            boxSpan.style.borderWidth = '0px';
            boxSpan.style.display = 'inline-block';
            boxSpan.style.flexShrink = 0;
            boxSpan.style.height = '16px';
            boxSpan.style.marginRight = '8px';
            boxSpan.style.width = '16px';

            // Text
            const textContainer = document.createElement('p');
            textContainer.style.color = item.fontColor;
            textContainer.style.margin = 0;
            textContainer.style.padding = 0;
            textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        });
    }
};

const extraLegendSpacePlugin = {
    id: 'extraLegendSpace',
    beforeInit(chart) {
        const originalFit = chart.legend.fit;
        chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)();
            this.height += 20;
        };
    },
};

const typeTooltip = Object.freeze({
    Porcentaje: '%',
    None: '',
});

const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div.chartjs-tooltip');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.classList.add('chartjs-tooltip');
        tooltipEl.style.background = '#004481';
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('table');
        table.style.margin = '0px';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
};

const externalTooltipHandler = (context, type) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set Text
    if (tooltip.dataPoints) {
        const values = tooltip.dataPoints.map(b => b.parsed.y);
        const tableHead = document.createElement('thead');
        const tableBody = document.createElement('tbody');
        values.forEach((value, i) => {
            const tr = document.createElement('tr');
            tr.style.backgroundColor = 'inherit';
            tr.style.borderWidth = 0;

            const td = document.createElement('td');
            td.style.borderWidth = 0;

            let text = ''
            if (type === typeTooltip.Porcentaje) {
                text = document.createTextNode(`${value}%`);
            } else {
                text = document.createTextNode(`${value}`);
            }

            td.appendChild(text);
            tr.appendChild(td);
            tableBody.appendChild(tr);
        });


        const tableRoot = tooltipEl.querySelector('table');

        // Remove old children
        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Ajusta la posición para que el tooltip aparezca arriba
    const adjustedPositionY = positionY + tooltip.caretY - tooltip.height;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = adjustedPositionY + 'px'; // Ajusta la posición Y
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';

};

const externalTooltipPercentage = (context) => {
    externalTooltipHandler(context, typeTooltip.Porcentaje);
};

const htmlLegendWhitSummationPlugin = {
    id: 'htmlLegendWhitSummation',
    afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // only first dataset
        const firstDataset = chart.data.datasets[0];
        const total = firstDataset.data.reduce((a, b) => a + b, 0);
        const icon = options.exceedsTheGoal ? '✓' : '✗';
        const title = options.title;

        const text = document.createTextNode(`${title} (Σ) ${total.toFixed(2)} % ${icon}`);
        const li = document.createElement('li');
        li.style.alignItems = 'center';
        li.style.cursor = 'pointer';
        li.style.display = 'flex';
        li.style.flexDirection = 'row';
        li.style.marginLeft = '10px';
        li.appendChild(text);
        ul.appendChild(li);
    }
};

const htmlLegendWhitSummationDoublePlugin = {
    id: 'htmlLegendWhitSummationDouble',
    afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // only first dataset
        const firstDataset = chart.data.datasets[0];
        const total = firstDataset.data.reduce((a, b) => a + b, 0);
        const total2 = chart.data.datasets[1].data.reduce((a, b) => a + b, 0);

        const text = document.createTextNode(`Acumulado actividad (Σ) ${total.toFixed(2)} %`);
        const text2 = document.createTextNode(`Acumulado errores (Σ) ${total2.toFixed(2)} %`);

        const li = document.createElement('li');
        li.style.alignItems = 'center';
        li.style.cursor = 'pointer';
        li.style.display = 'flex';
        li.style.flexDirection = 'row';
        li.style.marginLeft = '10px';
        li.appendChild(text);

        const li2 = document.createElement('li');
        li2.style.alignItems = 'center';
        li2.style.cursor = 'pointer';
        li2.style.display = 'flex';
        li2.style.flexDirection = 'row';
        li2.style.marginLeft = '10px';
        li2.appendChild(text2);

        ul.appendChild(li);
        ul.appendChild(li2);
    }
};


export { htmlLegendPlugin, extraLegendSpacePlugin, externalTooltipPercentage, htmlLegendWhitSummationPlugin, htmlLegendWhitSummationDoublePlugin };