"use strict"

let XMLNS = "http://www.w3.org/2000/svg"

const clamp = (val, min, max) => val < min ? min : val > max ? max : val

const arrLast = (arr) => arr[arr.length - 1]

const arrLinSearch = (arr, item) => {
	let result = false
	for (let cur of arr) {
		if (cur === item) {
			result = true
			break
		}
	}
	return result
}

const arrSeq = (start, end, step) => {
	let result = []
	let current = start
	for (; current < end; current += step) {
		result.push(current)
	}
	if (current <= end) {
		result.push(end)
	}
	return result
}

const scale = (value, valueMin, valueMax, scaleMin, scaleMax) => {
	let result = scaleMin
	let scaleRange = scaleMax - scaleMin
	if (scaleRange !== 0) {
		result = scaleRange / 2 + scaleMin
		let valueRange = valueMax - valueMin
		if (valueRange !== 0) {
			let value0 = value - valueMin
			let valueNorm = value0 / valueRange
			let valueScale0 = valueNorm * scaleRange
			result = valueScale0 + scaleMin
		}
	}
	return result
}

const createSvgElement = (name) => document.createElementNS(XMLNS, name)
const setSvgAttribute = (el, name, val) => el.setAttributeNS(null, name, val)

const createDomDiv = () => document.createElement("div")
const createDomInput = () => document.createElement("input")

const createSlider = (name, val, min, max, onChange, onClick) => {
	let container = createDomDiv()
	container.style.margin = "5px"
	container.style.width = "250px"
	container.style.height = "80px"

	let label = addDomTo(container, createDomDiv())
	label.style.display = "flex"
	label.style.cursor = "pointer"
	label.onclick = onClick

	let labelText = addDomTo(label, document.createElement("code"))
	labelText.style.fontSize = "x-large"
	labelText.innerHTML = `${name}: ${val.toFixed(2)}`

	let slider = addDomTo(container, createDomInput())
	slider.type = "range"
	slider.min = min * 100
	slider.max = max * 100
	slider.value = val * 100
	slider.step = 0.1

	slider.oninput = (e) => {
		val = e.target.value / 100
		labelText.innerHTML = `${name}: ${val.toFixed(2)}`
		onChange(val)
	}

	return container
}

const createDomSlide = (content) => {
	let div = createDomDiv()
	div.style.display = "flex"
	div.style.width = "100vw"
	div.style.height = "100vh"
	return div
}

let globalSlideTitleHeight = 50
const createDomTitle = (title) => {
	let domTitle = createDomDiv()
	domTitle.innerHTML = title
	domTitle.style.fontSize = "xxx-large"
	domTitle.style.display = "flex"
	domTitle.style.alignItems = "center"
	domTitle.style.textAlign = "center"
	domTitle.style.height = `${globalSlideTitleHeight}px`
	domTitle.style.paddingLeft = "10px"
	domTitle.style.paddingRight = "10px"
	return domTitle
}

const createDomTitleSubtitle = (title, subtitle) => {
	let domContainer = createDomDiv()
	domContainer.style.display = "flex"
	domContainer.style.flexDirection = "column"
	domContainer.style.justifyContent = "space-around"
	domContainer.style.alignItems = "center"

	let domTitle = addDomTo(domContainer, createDomTitle(title))

	let domSubtitle = addDomDivTo(domContainer)
	domSubtitle.innerHTML = subtitle
	domSubtitle.style.fontSize = "xx-large"
	domSubtitle.style.textAlign = "center"

	return domContainer
}

const createPoints = (points, store) => {
	let container = createDomDiv()
	for (let point of points) {
		let domPoint = addDomDivTo(container)
		if (typeof point === "string") {
			domPoint.innerHTML = point
			domPoint.style.marginBottom = "10px"
		} else {
			domPoint.appendChild(point)
		}
		domPoint.style.visibility = "hidden"
		store.push(domPoint)
	}
	return container
}

const createTableCell = (content) => {
	let cell = createDomDiv()
	if (typeof content === "string") {
		cell.innerHTML = content
	} else {
		cell.appendChild(content)
	}
	cell.style.width = "250px"
	cell.style.overflow = "hidden"
	cell.style.whiteSpace = "nowrap"
	return cell
}

const createTableRow = () => {
	let row = createDomDiv()
	row.style.display = "flex"
	row.style.flexDirection = "row"
	return row
}

const createTableRowFrom = (cells) => {
	let row = createTableRow()
	for (let cell of cells) {
		let domCell = addDomTo(row, createTableCell(cell))
	}
	return row
}

const createTable = () => {
	let table = createDomDiv()
	table.style.display = "flex"
	table.style.flexDirection = "column"
	return table
}

const createMath = (expr) => {
	let div = document.createElement("code")
	div.innerHTML = expr
	return div
}

const createTable2x2 = (vo, vn, uo, un) => {
	let table = createTable()

	const addRow = (cell1String, cell2Content, cell3Content) => {
		let row = addDomTo(table, createTableRow())
		let cell1 = addDomTo(row, createTableCell(cell1String))
		cell1.style.textAlign = "right"
		let cell2 = addDomTo(row, createTableCell(cell2Content))
		cell2.style.textAlign = "center"
		let cell3 = addDomTo(row, createTableCell(cell3Content))
		cell3.style.textAlign = "center"
	}

	addRow("", "Outcome", "No Outcome")
	addRow("Vaccinated", createMath(vo), createMath(vn))
	addRow("Unvaccinated", createMath(uo), createMath(un))

	return table
}

const createTableClassic2x2 = () => {
	let table = createTable2x2("vo", "vn", "uo", "un")
	table.style.marginBottom = "50px"
	return table
}

const createLine = (x1, x2, y1, y2, col) => {
	let line = createSvgElement("line")
	setSvgAttribute(line, "x1", x1)
	setSvgAttribute(line, "x2", x2)
	setSvgAttribute(line, "y1", y1)
	setSvgAttribute(line, "y2", y2)
	setSvgAttribute(line, "stroke", col)
	setSvgAttribute(line, "stroke-width", 2.5)
	return line
}

const createVLine = (x, y1, y2, col) => createLine(x, x, y1, y2, col)
const createHLine = (x1, x2, y, col) => createLine(x1, x2, y, y, col)

const createLabelledLine = (x1, x2, y1, y2, col, lab) => {
	let container = createSvgElement("g")
	addDomTo(container, createLine(x1, x2, y1, y2, col))
	addDomTo(container, createSvgText(x2, y2, lab, col, "start", "middle"))
	return container
}

const createLabelledVLine = (x, y1, y2, col, lab) => createLabelledLine(x, x, y1, y2, col, lab)
const createLabelledHLine = (x1, x2, y, col, lab) => createLabelledLine(x1, x2, y, y, col, lab)

const createFunLine = (from, to, fun, scaleX, scaleY, ymin, ymax, col, lastInBounds) => {
	const container = createSvgElement("g")

	if (lastInBounds !== undefined) {
		lastInBounds.x = scaleX(to)
		lastInBounds.y = scaleY(fun(to))
	}

	if (to !== from) {
		if (to < from) {
			let temp = to
			to = from
			from = temp
		}

		let lastOg = from
		let lastScaled = scaleX(from)
		let lastYOg = fun(from)
		let lastYScaled = scaleY(lastYOg)
		let step = (to - from) / 100
		let current = from + step
		let breakAfter = false
		for (; !breakAfter; current += step) {
			if (current >= to) {
				current = to
				breakAfter = true
			}
			let currentScaled = scaleX(current)
			let currentY = fun(current)
			let currentYScaled = scaleY(currentY)
			if (currentY >= ymin && currentY <= ymax) {
				addDomTo(container, createLine(lastScaled, currentScaled, lastYScaled, currentYScaled, col))
				if (lastInBounds !== undefined) {
					lastInBounds.x = currentScaled
					lastInBounds.y = currentYScaled
				}
			} else if (lastYOg >= ymin && lastYOg <= ymax) {
				let lerpFactor = 1
				if (currentY > ymax) {
					lerpFactor = (ymax - lastYOg) / (currentY - lastYOg)
				} else if (currentY < ymin) {
					lerpFactor = (lastYOg - ymin) / (currentY - lastYOg)
				}
				lerpFactor = clamp(lerpFactor, 0, 1)
				let currentLerped = lastOg + lerpFactor * step
				let currentLerpedScaled = scaleX(currentLerped)
				let currentYLerpedScaled = scaleY(fun(currentLerped))
				addDomTo(container, createLine(lastScaled, currentLerpedScaled, lastYScaled, currentYLerpedScaled, col))
				if (lastInBounds !== undefined) {
					lastInBounds.x = currentLerpedScaled
					lastInBounds.y = currentYLerpedScaled
				}
			}
			lastOg = current
			lastScaled = currentScaled
			lastYOg = currentY
			lastYScaled = currentYScaled
		}
	}

	return container
}

const createLabelledFunLine = (from, to, fun, scaleX, scaleY, ymin, ymax, col, lab, vAlign) => {
	let container = createSvgElement("g")
	let lastInBounds = {}
	addDomTo(container, createFunLine(from, to, fun, scaleX, scaleY, ymin, ymax, col, lastInBounds))
	addDomTo(container, createSvgText(lastInBounds.x, lastInBounds.y, lab, col, "start", vAlign))
	return container
}

const createSvgText = (x, y, text, col, textAnchor, dominantBaseline) => {
	let textEl = createSvgElement("text")
	setSvgAttribute(textEl, "x", x)
	setSvgAttribute(textEl, "y", y)
	setSvgAttribute(textEl, "fill", col)
	setSvgAttribute(textEl, "text-anchor", textAnchor)
	setSvgAttribute(textEl, "dominant-baseline", dominantBaseline)
	setSvgAttribute(textEl, "font-size", "large")
	textEl.innerHTML = text
	return textEl
}

const createPlotGrid = (xTicks, yTicks, scaleX, scaleY) => {
	let container = createSvgElement("g")

	let gridCol = "#55555566"
	let tickCol = "#555555"
	let textCol = "#aaaaaa"
	let tickLength = 5

	let gridTop = scaleY(arrLast(yTicks))
	let gridBottom = scaleY(yTicks[0])
	for (let xTick of xTicks) {
		let xTickCoord = scaleX(xTick)
		addDomTo(container, createVLine(xTickCoord, gridTop, gridBottom, gridCol))
		addDomTo(container, createVLine(xTickCoord, gridBottom, gridBottom + tickLength, tickCol))
		addDomTo(container, createSvgText(
			xTickCoord, gridBottom + tickLength * 2,
			xTick.toFixed(1), textCol, "middle", "hanging"
		))
	}

	let gridLeft = scaleX(xTicks[0])
	let gridRight = scaleX(arrLast(xTicks))
	for (let yTick of yTicks) {
		let yTickCoord = scaleY(yTick)
		addDomTo(container, createHLine(gridLeft, gridRight, yTickCoord, gridCol))
		addDomTo(container, createHLine(gridLeft - tickLength, gridLeft, yTickCoord, tickCol))
		addDomTo(container, createSvgText(
			gridLeft - tickLength * 2, yTickCoord,
			yTick.toFixed(1), textCol, "end", "middle"
		))
	}

	return container
}

const setSvgDim = (svg, width, height) => {
	setSvgAttribute(svg, "viewBox", `0 0 ${width} ${height}`)
	setSvgAttribute(svg, "width", width)
	setSvgAttribute(svg, "height", height)
}

const createORPlot = () => {
	let container = createDomDiv()
	container.style.display = "flex"

	let plot = addDomTo(container, createSvgElement("svg"))
	plot.style.flexShrink = "0"
	plot.style.display = "block"

	let width = 400
	let height = 400
	setSvgAttribute(plot, "viewBox", `0 0 ${width} ${height}`)
	setSvgAttribute(plot, "width", width)
	setSvgAttribute(plot, "height", height)

	let pads = {
		axis: {t: 20, l: 20, r: 20, b: 30},
		data: {t: 20, l: 20, r: 20, b: 20},
	}

	let axisLabCol = "#bbbbbb"

	let scaleX = (val) => scale(val, 0, 1, pads.axis.l + pads.data.l, width - pads.axis.r - pads.data.r)
	let scaleY = (val) => scale(val, 0, 1, height - pads.axis.b - pads.data.b, pads.axis.t + pads.data.t)

	addDomTo(plot, createPlotGrid(arrSeq(0, 1, 0.1), arrSeq(0, 1, 0.1), scaleX, scaleY))
	addDomTo(plot, createSvgText(
		scaleX(0.5), height - pads.axis.b + 10,
		"p", axisLabCol, "middle", "hanging"
	))

	let veTrue = 0.40
	let veLineCol = "#aaaaaa"
	let rrLineCol = "#11bbbb"

	const addVELine = () => {
		let line = addDomTo(plot, createLabelledHLine(scaleX(0), scaleX(1), scaleY(veTrue), veLineCol, "ve"))
		return line
	}

	const addRRLine = () => {
		let line = addDomTo(plot, createLabelledHLine(scaleX(0), scaleX(1), scaleY(1 - veTrue), rrLineCol, "rr"))
		return line
	}

	const orFunFull = (ve, p) => {
		let v = 0.6
		let pVac = p * (1 - ve)

		let vo = v * pVac
		let vn = v * (1 - pVac)
		let uo = (1 - v) * p
		let un = (1 - v) * (1 - p)

		let or = (vo * un) / (vn * uo)
		return or
	}

	let pUnvac = 0.1

	const orFunVE = (ve) => orFunFull(ve, pUnvac)
	const orFunP = (p) => orFunFull(veTrue, p)

	let orLineCol = "#bbbb11"
	let addORLine = () => {
		let line = addDomTo(plot, createLabelledFunLine(0.001, 1, orFunP, scaleX, scaleY, 0, 1, orLineCol, "or", "middle"))
		return line
	}

	let orLineEl = addORLine()
	let veLineEl = addVELine()
	let rrLineEl = addRRLine()

	let veSlider = addDomTo(container, createSlider(
		"ve", veTrue, 0, 1, (newVal) => {
			plot.removeChild(veLineEl)
			plot.removeChild(rrLineEl)
			plot.removeChild(orLineEl)
			veTrue = newVal
			veLineEl = addVELine()
			rrLineEl = addRRLine()
			orLineEl = addORLine()
		}
	))

	return container
}

const createFullORPlot = () => {
	let container = createDomDiv()
	container.style.display = "flex"
	container.style.flexDirection = "row"
	container.style.alignItems = "center"
	container.style.height = `calc(100vh - ${globalSlideTitleHeight}px)`

	let plot = addDomTo(container, createSvgElement("svg"))
	plot.style.flexShrink = "0"
	plot.style.display = "block"

	const getPlotWidth = () => window.innerWidth * 0.5
	let width = getPlotWidth()
	let height = 500
	setSvgDim(plot, width, height)

	let pads = {
		axis: {t: 20, l: 35, r: 40, b: 30},
		data: {t: 20, l: 20, r: 20, b: 20},
	}

	let xAxisMin = 0
	let xAxisMax = 1
	let yAxisMin = 0
	let yAxisMax = 1

	let axisLabCol = "#bbbbbb"

	let createScaleX = () => (val) => scale(val, xAxisMin, xAxisMax, pads.axis.l + pads.data.l, width - pads.axis.r - pads.data.r)
	let scaleX = createScaleX()

	let createScaleY = () => (val) => scale(val, 0, 1, height - pads.axis.b - pads.data.b, pads.axis.t + pads.data.t)
	let scaleY = createScaleY()

	let addPlotGrid = () => addDomTo(plot, createPlotGrid(
		arrSeq(xAxisMin, xAxisMax, 0.1), arrSeq(yAxisMin, yAxisMax, 0.1), scaleX, scaleY)
	)
	let plotGridEl = addPlotGrid()

	let xlab = "pInfUnvac"
	const addXLab = () => {
		let el = addDomTo(plot, createSvgText(
			scaleX((xAxisMax + xAxisMin) / 2), height - pads.axis.b + 10,
			xlab, axisLabCol, "middle", "hanging"
		))
		el.style.fontFamily = "monospace"
		return el
	}
	let xlabEl = addXLab()

	let yAxisLabEl = addDomTo(plot, createSvgText(0, 0, "VE", axisLabCol, "middle", "hanging"))
	setSvgAttribute(yAxisLabEl, "transform", `translate(0, ${scaleY((yAxisMax + yAxisMin) / 2)}) rotate(-90)`)

	let params = {}
	params.veInf = 0.40
	params.veSympt = 0
	params.vacCoverage = 0.4
	params.pInfUnvac = 0.1
	params.pSymptUnvac = 1
	params.pOther = 0.3
	params.pHealthVac = 1
	params.pHealthUnvac = 1
	params.rrInfOther = 1
	params.pUninfVac = 1
	params.pUninfUnvac = 1
	params.sens = 1
	params.spec = 1
	params.pInfDouble = 0

	let veLineCol = "#bbbbbb"

	const getVE = (veInf, veSympt) => 1 - (1 - veInf) * (1 - veSympt)

	const addVELine = () => {
		let line = null
		let veTrue = getVE(params.veInf, params.veSympt)
		if (xlab === "veInf") {
			line = addDomTo(plot, createFunLine(
				xAxisMin, xAxisMax, (veInf) => getVE(veInf, params.veSympt),
				scaleX, scaleY, yAxisMin, yAxisMax, veLineCol,
			))
		} else if (xlab === "veSympt") {
			line = addDomTo(plot, createFunLine(
				xAxisMin, xAxisMax, (veSympt) => getVE(params.veInf, veSympt),
				scaleX, scaleY, yAxisMin, yAxisMax, veLineCol,
			))
		} else {
			line = addDomTo(plot, createHLine(scaleX(xAxisMin), scaleX(xAxisMax), scaleY(veTrue), veLineCol))
		}
		return line
	}

	let veLineEl = addVELine()

	const getExpectedProportions = (params) => {
		let veInf = params.veInf
		let veSympt = params.veSympt
		let v = params.vacCoverage
		let pInf = params.pInfUnvac
		let pSympt = params.pSymptUnvac
		let pOther = params.pOther
		let pHealthUnvac = params.pHealthVac
		let pHealthVac = params.pHealthUnvac
		let rrInfOther = params.rrInfOther
		let pUninfVac = params.pUninfVac
		let pUninfUnvac = params.pUninfUnvac
		let pInfDouble = params.pInfDouble

		let pVacInf = pInf * (1 - veInf) * rrInfOther
		let pVacSympt = pSympt * (1 - veSympt)

		let caseVac = v * pVacInf * (pVacSympt + (1 - pVacSympt) * pOther * pInfDouble) * pHealthVac * pUninfVac
		let caseUnvac = (1 - v) * pInf * (pSympt + (1 - pSympt) * pOther * pInfDouble) * pHealthUnvac * pUninfUnvac

		let controlCommunityVac = v * (1 - (pOther + (1 - pOther * pInfDouble) * pVacInf * pVacSympt * pUninfVac) * pHealthVac)
		let controlCommunityUnvac = (1 - v) * (1 - (pOther + (1 - pOther * pInfDouble) * pInf * pSympt * pUninfUnvac) * pHealthUnvac)

		let controlNegVac = v * pOther * (1 - pVacInf * pInfDouble) * pHealthVac
		let controlNegUnvac = (1 - v) * pOther * (1 - pInf * pInfDouble) * pHealthUnvac

		return {
			caseVac: caseVac,
            caseUnvac: caseUnvac,
            controlCommunityVac: controlCommunityVac,
            controlCommunityUnvac: controlCommunityUnvac,
            controlNegVac: controlNegVac,
            controlNegUnvac: controlNegUnvac,
		}
	}

	const getVEFrom2x2 = (vo, vn, uo, un, sens, spec) => {
		let voMiss = vo * sens + vn * (1 - spec)
		let vnMiss = vn * spec + vo * (1 - sens)
		let uoMiss = uo * sens + un * (1 - spec)
		let unMiss = un * spec + uo * (1 - sens)
		let or = (voMiss * unMiss) / (vnMiss * uoMiss)
		let veEst = 1 - or
		return veEst
	}

	const veCCFunFull = (params) => {
		let props = getExpectedProportions(params)
		let veEst = getVEFrom2x2(
			props.caseVac, props.controlCommunityVac, props.caseUnvac, props.controlCommunityUnvac,
			params.sens, params.spec
		)
		return veEst
	}

	const veCCGenFunFull = (params) => {
		let props = getExpectedProportions(params)
		let veEst = getVEFrom2x2(
			props.caseVac, props.controlNegVac + props.controlCommunityVac, 
			props.caseUnvac, props.controlNegUnvac + props.controlCommunityUnvac,
			params.sens, params.spec
		)
		return veEst
	}

	const veTNFunFull = (params) => {
		let props = getExpectedProportions(params)
		let veEst = getVEFrom2x2(
			props.caseVac, props.controlNegVac, props.caseUnvac, props.controlNegUnvac,
			params.sens, params.spec
		)
		return veEst
	}

	const veFunOne = (val, fun) => {
		let paramsCopy = {...params}
		paramsCopy[xlab] = val
		let result = fun(paramsCopy)
		return result
	}

	const addVEEstLine = (fun, col, lbl, vAlign) => {
		let line = addDomTo(plot, createLabelledFunLine(
			clamp(xAxisMin, 0.001, xAxisMax), clamp(xAxisMax, xAxisMin, 0.999),
			(val) => veFunOne(val, fun),
			scaleX, scaleY, yAxisMin, yAxisMax, col, lbl, vAlign
		))
		return line
	}

	let veCCLineCol = "#61de2a"
	let veCCGenLineCol = "#e1e114"
	let veTNLineCol = "#ff69b4"

	let addVECCLine = () => addVEEstLine(veCCFunFull, veCCLineCol, "cc(hlth)", "hanging")
	let addVECCGenLine = () => addVEEstLine(veCCGenFunFull, veCCGenLineCol, "cc(gen)", "middle")
	let addVETNLine = () => addVEEstLine(veTNFunFull, veTNLineCol, "tn", "text-bottom")

	let veCCLineEl = addVECCLine()
	let veCCGenLineEl = addVECCGenLine()
	let veTNLineEl = addVETNLine()

	const redrawLines = () => {
		plot.removeChild(veLineEl)
		plot.removeChild(veCCLineEl)
		plot.removeChild(veCCGenLineEl)
		plot.removeChild(veTNLineEl)
		plot.removeChild(xlabEl)
		veLineEl = addVELine()
		veCCLineEl = addVECCLine()
		veCCGenLineEl = addVECCGenLine()
		veTNLineEl = addVETNLine()
		xlabEl = addXLab()
	}

	const changeXLab = (newXLab) => {
		if (xlab !== newXLab) {
			xlab = newXLab
			redrawLines()
			for (let slider of Object.values(sliders)) {
				slider.style.background = "var(--color-background)"
			}
			sliders[newXLab].style.background = "var(--color-selected)"
		}
	}

	let slidersScrollContainer = addDomDivTo(container)
	slidersScrollContainer.style.height = `100%`
	slidersScrollContainer.style.overflowY = "scroll"
	slidersScrollContainer.style.display = "flex"

	let slidersContainer = addDomDivTo(slidersScrollContainer)
	slidersContainer.style.display = "flex"
	slidersContainer.style.flexDirection = "row"
	slidersContainer.style.flexWrap = "wrap"
	slidersContainer.style.justifyContent = "center"

	let sliders = {}

	const addSlider = (name, min, max) => {
		sliders[name] = addDomTo(slidersContainer, createSlider(
			name, params[name], min, max,
			(newVal) => { params[name] = newVal; redrawLines() },
			() => { changeXLab(name); },
		))
	}

	addSlider("veInf", 0.001, 1)
	addSlider("veSympt", 0.001, 1)
	addSlider("vacCoverage", 0.00001, 0.9999)
	addSlider("pInfUnvac", 0.00001, 0.5)
	addSlider("pSymptUnvac", 0.00001, 1)
	addSlider("pOther", 0.00001, 0.5)
	addSlider("pInfDouble", 0, 1)
	addSlider("pHealthVac", 0.00001, 1)
	addSlider("pHealthUnvac", 0.00001, 1)
	addSlider("rrInfOther", 0.5, 1.5)
	addSlider("pUninfVac", 0, 1)
	addSlider("pUninfUnvac", 0, 1)
	addSlider("sens", 0.5, 1)
	addSlider("spec", 0.5, 1)

	const redrawLinesAndGrid = () => {
		scaleX = createScaleX()
		scaleY = createScaleY()

		plot.removeChild(plotGridEl)
		plotGridEl = addPlotGrid()

		redrawLines()
	}

	window.addEventListener("keydown", (e) => {
		switch (e.key) {
		case ",": {xAxisMin = clamp(xAxisMin + 0.1, 0, xAxisMax - 0.1); redrawLinesAndGrid()}; break
		case "<": {xAxisMin = clamp(xAxisMin - 0.1, 0, xAxisMax - 0.1); redrawLinesAndGrid()}; break
		case ".": {xAxisMax = clamp(xAxisMax - 0.1, xAxisMin + 0.1, 1); redrawLinesAndGrid()}; break
		case ">": {xAxisMax = clamp(xAxisMax + 0.1, xAxisMin + 0.1, 1); redrawLinesAndGrid()}; break
		}
	})

	window.addEventListener("resize", (e) => {
		width = getPlotWidth();
		setSvgDim(plot, width, height);
		redrawLinesAndGrid()
	})

	sliders[xlab].style.background = "var(--color-selected)"
	return container
}

const addDomTo = (parent, node) => {
	parent.appendChild(node)
	return node
}

const addDomDivTo = (parent) => addDomTo(parent, createDomDiv())

const removeChildren = (parent) => {
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild)
	}
}

//
// SECTION State
//

let globalState = {
	domMain: document.getElementById("main"),
	currentSlide: 0,
	slides: [],
	slideState: [],
	slidePoints: [],
}

const loadGlobalState = () => {
	let state = localStorage.getItem("globalState")
	if (state !== null) {
		state = JSON.parse(state)
		globalState = Object.assign(globalState, state)
	}
}

const storeGlobalState = () => {
	let state = {}
	state.currentSlide = globalState.currentSlide
	state.slideState = globalState.slideState
	localStorage.setItem("globalState", JSON.stringify(state))
}

const addDomSlide = () => {
	let slide = createDomSlide()
	globalState.slides.push(slide)
	globalState.slideState.push(0)
	globalState.slidePoints.push([])
	return slide
}

const addDomSlideWithTitle = (titleContent) => {
	let slide = addDomSlide()
	slide.style.flexDirection = "column"

	let title = addDomTo(slide, createDomTitle(titleContent))
	title.style.whiteSpace = "nowrap"

	let mainContentScroll = addDomDivTo(slide)
	mainContentScroll.style.height = `calc(100vh - ${globalSlideTitleHeight}px)`
	mainContentScroll.style.overflowY = "scroll"

	let mainContent = addDomDivTo(mainContentScroll)
	mainContent.style.paddingLeft = "10px"
	mainContent.style.paddingRight = "10px"

	return mainContent
}

const addPointsToLastSlide = (parent, points) => {
	let pointsEl = addDomTo(parent, createPoints(points, arrLast(globalState.slidePoints)))
	return pointsEl
}

const addDomSlideWithTitleAndPoints = (title, points) => {
	let slide = addDomSlideWithTitle(title)
	slide.style.marginTop = "50px"
	addPointsToLastSlide(slide, points)
}

const switchToSlide = (index) => {
	index = clamp(index, 0, globalState.slides.length - 1)
	globalState.currentSlide = index
	removeChildren(globalState.domMain)
	globalState.domMain.appendChild(globalState.slides[globalState.currentSlide])
	switchInSlide(globalState.slideState[index])
}

const nextSlide = () => switchToSlide(globalState.currentSlide + 1)
const previousSlide = () => switchToSlide(globalState.currentSlide - 1)

const switchInSlide = (slideState) => {
	let slidePoints = globalState.slidePoints[globalState.currentSlide]
	slideState = clamp(slideState, 0, slidePoints.length)
	for (let childIndex = 0; childIndex < slideState; childIndex += 1) {
		let child = slidePoints[childIndex]
		child.style.visibility = "visible"
	}
	for (let childIndex = slideState; childIndex < slidePoints.length; childIndex += 1) {
		let child = slidePoints[childIndex]
		child.style.visibility = "hidden"
	}
	globalState.slideState[globalState.currentSlide] = slideState
	storeGlobalState()
}

const slideForward = () => switchInSlide(globalState.slideState[globalState.currentSlide] + 1)
const slideBack = () => switchInSlide(globalState.slideState[globalState.currentSlide] - 1)

// NOTE(sen) Title slide
{
	let slide = addDomSlide()
	slide.style.justifyContent = "center"
	let domTitleSubtitle = addDomTo(
		slide,
		createDomTitleSubtitle(
			"Theoretical framework for Retrospective Studies of the Effectiveness of SARS-CoV-2 Vaccines",
			"2022-03-23",
		)
	)
}

// NOTE(sen) Study design overview
{
	addDomSlideWithTitleAndPoints("Retrospective studies", [
		"Cases - have had outcome (infection/symptoms/death)",
		"Controls - have not had outcome (infection/symptoms/death)",
		"Case-control study - controls come from the general population",
		"Test-negative study - controls had alternative cause for outcome",
	])
}

// NOTE(sen) VE
{
	addDomSlideWithTitleAndPoints("Vaccine Effectiveness", [
		"1 - risk ratio (of outcome for vaccinated vs unvaccinated)",
		"Risk reduction due to vaccination",
	])
}

// NOTE(sen) Risk of outcome
{
	addDomSlideWithTitleAndPoints("Risk of outcome", [
		createTableClassic2x2(),
		"rv = vo / (vo + vn)",
		"ru = uo / (uo + un)",
	])
}

// NOTE(sen) Risk of vaccination
{
	let slide = addDomSlideWithTitle("Risk of vaccination")
	let table = addDomTo(slide, createTableClassic2x2())
	table.style.marginTop = "50px"
	addPointsToLastSlide(slide, [
		"ro = vo / (vo + uo)",
		"rn = vn / (vn + un)",
	])
}

// NOTE(sen) Odds of vaccination
{
	let slide = addDomSlideWithTitle("Odds of vaccination")
	let table = addDomTo(slide, createTableClassic2x2())
	table.style.marginTop = "50px"
	addPointsToLastSlide(slide, [
		"oo = vo / uo",
		"on = vn / un",
		"or = oo / on = (vo * un) / (vn * uo)",
		"ov = vo / vn",
		"ou = uo / un",
		"or = ov / ou = (vo * un) / (vn * uo)",
	])
}

// NOTE(sen) OR properties (test-negative)
{
	let slide = addDomSlideWithTitle("OR properties (test-negative)")
	let table = createTable2x2("v*p*(1-ve)", "v*k", "(1-v)*p", "(1-v)*k")
	table.style.marginBottom = "20px"
	table.style.marginTop = "50px"
	addPointsToLastSlide(slide, [
		table,
		"or = 1-ve = rr",
	])
}

// NOTE(sen) OR properties (case-control)
{
	let slide = addDomSlideWithTitle("OR properties (case-control)")
	let table = createTable2x2("v*p*(1-ve)", "v*(1-p*(1-ve))", "(1-v)*p", "(1-v)*(1-p)")
	table.style.marginBottom = "20px"
	let plot = createORPlot()
	addPointsToLastSlide(slide, [
		table,
		createMath("or = (1-ve)*(1-p) / (1-p*(1-ve))"),
		plot
	])
}

// NOTE(sen) OR properties (more complexity)
{
	let slide = addDomSlideWithTitle("OR properties (more complexity)")
	let plot = createFullORPlot()
	addPointsToLastSlide(slide, [
		plot
	])
}

// NOTE(sen) End slide
{
	let slide = addDomSlide()
	slide.style.justifyContent = "center"
	let domTitleSubtitle = addDomTo(
		slide,
		createDomTitleSubtitle(
			"End of presentation",
			"",
		),
	)
}

// NOTE(sen) Init
{
	loadGlobalState()
	switchToSlide(globalState.currentSlide)
	window.onkeydown = (e) => {
		switch (e.key) {
		case "ArrowRight": { nextSlide() } break;
		case "ArrowLeft": { previousSlide() } break;
		case "ArrowDown": { slideForward() } break;
		case "ArrowUp": { slideBack() } break;
		}
	}
}
