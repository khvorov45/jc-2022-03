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
	for (let current = start; current < end; current += step) {
		result.push(current)
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

	let label = addDomTo(container, createDomDiv)
	label.style.display = "flex"
	label.style.cursor = "pointer"
	label.onclick = onClick

	let labelText = addDomTo(label, createDomDiv)
	labelText.innerHTML = `${name}: ${val.toFixed(2)}`

	let slider = addDomTo(container, createDomInput)
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
	div.style.justifyContent = "center"
	div.style.alignItems = "center"
	return div
}

const createDomTitle = (title) => {
	let domTitle = createDomDiv()
	domTitle.innerHTML = title
	domTitle.style.fontSize = "xx-large"
	domTitle.style.textAlign = "left"
	return domTitle
}

const createDomTitleSubtitle = (title, subtitle) => {
	let domContainer = createDomDiv()
	domContainer.style.display = "flex"
	domContainer.style.flexDirection = "column"
	domContainer.style.justifyContent = "center"
	domContainer.style.alignItems = "center"

	let domTitle = addDomDivTo(domContainer)
	domTitle.innerHTML = title
	domTitle.style.fontSize = "xx-large"
	domTitle.style.textAlign = "center"
	domTitle.style.marginBottom = "50px"

	let domSubtitle = addDomDivTo(domContainer)
	domSubtitle.innerHTML = subtitle
	domSubtitle.fontSize = "large"
	domSubtitle.textAlign = "center"

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
		domPoint.style.visibility = "visible"
		store.push(domPoint)
	}
	return container
}

const createTableCell = (content) => {
	let cell = createDomDiv()
	cell.innerHTML = content
	cell.style.width = "200px"
	return cell
}

const createTableRow = (cells) => {
	let row = createDomDiv()
	row.style.display = "flex"
	row.style.flexDirection = "row"
	for (let cell of cells) {
		let domCell = addDomTo(row, createTableCell, cell)
	}
	return row
}

const createTableFromRows = (rows) => {
	let table = createDomDiv()
	table.style.display = "flex"
	table.style.flexDirection = "column"
	for (let row of rows) {
		let domRow = addDomTo(table, createTableRow, row)
	}
	return table
}

const createTable2x2 = (vo, vn, uo, un) => {
	let table = createTableFromRows([
		["", "Outcome", "No Outcome"],
		["Vaccinated", vo, vn],
		["Unvaccinated", uo, un],
	])
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
	return line
}

const createVLine = (x, y1, y2, col) => createLine(x, x, y1, y2, col)
const createHLine = (x1, x2, y, col) => createLine(x1, x2, y, y, col)

const createLabelledLine = (x1, x2, y1, y2, col, lab) => {
	let container = createSvgElement("g")
	addDomTo(container, createLine, x1, x2, y1, y2, col)
	addDomTo(container, createSvgText, x2, y2, lab, col, "start", "middle")
	return container
}

const createLabelledVLine = (x, y1, y2, col, lab) => createLabelledLine(x, x, y1, y2, col, lab)
const createLabelledHLine = (x1, x2, y, col, lab) => createLabelledLine(x1, x2, y, y, col, lab)

const createFunLine = (from, to, fun, scaleX, scaleY, col) => {
	const container = createSvgElement("g")
	let last = scaleX(from)
	let lastY = scaleY(fun(from))
	let step = (to - from) / 100
	let current = from + step
	for (; current < to; current += step) {
		let currentScaled = scaleX(current)
		let currentY = fun(current)
		let currentYScaled = scaleY(currentY)
		addDomTo(container, createLine, last, currentScaled, lastY, currentYScaled, col)
		last = currentScaled
		lastY = currentYScaled
	}
	if (current !== from) {
		addDomTo(container, createLine, last, scaleX(to), lastY, scaleY(fun(to)), col)
	}
	return container
}

const createLabelledFunLine = (from, to, fun, scaleX, scaleY, col, lab) => {
	let container = createSvgElement("g")
	addDomTo(container, createFunLine, from, to, fun, scaleX, scaleY, col)
	addDomTo(container, createSvgText, scaleX(to), scaleY(fun(to)), lab, col, "start", "middle")
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
		addDomTo(container, createVLine, xTickCoord, gridTop, gridBottom, gridCol)
		addDomTo(container, createVLine, xTickCoord, gridBottom, gridBottom + tickLength, tickCol)
		addDomTo(
			container, createSvgText, xTickCoord, gridBottom + tickLength * 2,
			xTick.toFixed(1), textCol, "middle", "hanging"
		)
	}

	let gridLeft = scaleX(xTicks[0])
	let gridRight = scaleX(arrLast(xTicks))
	for (let yTick of yTicks) {
		let yTickCoord = scaleY(yTick)
		addDomTo(container, createHLine, gridLeft, gridRight, yTickCoord, gridCol)
		addDomTo(container, createHLine, gridLeft - tickLength, gridLeft, yTickCoord, tickCol)
		addDomTo(
			container, createSvgText, gridLeft - tickLength * 2, yTickCoord,
			yTick.toFixed(1), textCol, "end", "middle"
		)
	}

	return container
}

const createORPlot = () => {
	let container = createDomDiv()
	container.style.display = "flex"

	let plot = addDomTo(container, createSvgElement, "svg")
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

	addDomTo(plot, createPlotGrid, arrSeq(0, 1, 0.1), arrSeq(0, 1, 0.1), scaleX, scaleY)
	addDomTo(
		plot, createSvgText, scaleX(0.5), height - pads.axis.b + 10,
		"p", axisLabCol, "middle", "hanging"
	)

	let veTrue = 0.40
	let veLineCol = "#bbbb11"
	let rrLineCol = "#11bbbb"

	const addVELine = () => {
		let line = addDomTo(plot, createLabelledHLine, scaleX(0), scaleX(1), scaleY(veTrue), veLineCol, "ve")
		return line
	}

	const addRRLine = () => {
		let line = addDomTo(plot, createLabelledHLine, scaleX(0), scaleX(1), scaleY(1 - veTrue), rrLineCol, "rr")
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

	let orLineCol = "#aaaaaa"
	let addORLine = () => {
		let line = addDomTo(plot, createLabelledFunLine, 0.001, 1, orFunP, scaleX, scaleY, orLineCol, "or")
		return line
	}

	let orLineEl = addORLine()
	let veLineEl = addVELine()
	let rrLineEl = addRRLine()

	let veSlider = addDomTo(container, createSlider, "ve", veTrue, 0, 1, (newVal) => {
		plot.removeChild(veLineEl)
		plot.removeChild(rrLineEl)
		plot.removeChild(orLineEl)
		veTrue = newVal
		veLineEl = addVELine()
		rrLineEl = addRRLine()
		orLineEl = addORLine()
	})

	return container
}

const createFullORPlot = () => {
	let container = createDomDiv()
	container.style.display = "flex"
	container.style.flexDirection = "column"
	container.style.alignItems = "center"

	let plot = addDomTo(container, createSvgElement, "svg")
	plot.style.flexShrink = "0"
	plot.style.display = "block"

	let width = window.innerWidth * 0.75
	let height = 400
	setSvgAttribute(plot, "viewBox", `0 0 ${width} ${height}`)
	setSvgAttribute(plot, "width", width)
	setSvgAttribute(plot, "height", height)

	let pads = {
		axis: {t: 20, l: 20, r: 40, b: 30},
		data: {t: 20, l: 20, r: 20, b: 20},
	}

	let axisLabCol = "#bbbbbb"

	let scaleX = (val) => scale(val, 0, 1, pads.axis.l + pads.data.l, width - pads.axis.r - pads.data.r)
	let scaleY = (val) => scale(val, 0, 1, height - pads.axis.b - pads.data.b, pads.axis.t + pads.data.t)

	addDomTo(plot, createPlotGrid, arrSeq(0, 1, 0.1), arrSeq(0, 1, 0.1), scaleX, scaleY)
	let xlab = "p"
	const addXLab = () => {
		let el = addDomTo(
			plot, createSvgText, scaleX(0.5), height - pads.axis.b + 10,
			xlab, axisLabCol, "middle", "hanging"
		)
		return el
	}
	let xlabEl = addXLab()

	let veInf = 0.40
	let veSympt = 0
	let veLineCol = "#bbbb11"

	const getVE = (veInf, veSympt) => 1 - (1 - veInf) * (1 - veSympt)

	const addVELine = () => {
		let line = null
		let veTrue = getVE(veInf, veSympt)
		if (xlab === "veInf") {
			line = addDomTo(
				plot, createLabelledFunLine, 0, 1, (veInf) => getVE(veInf, veSympt),
				scaleX, scaleY, veLineCol, "ve",
			)
		} else if (xlab === "veSympt") {
			line = addDomTo(
				plot, createLabelledFunLine, 0, 1, (veSympt) => getVE(veInf, veSympt),
				scaleX, scaleY, veLineCol, "ve",
			)
		} else {
			line = addDomTo(plot, createLabelledHLine, scaleX(0), scaleX(1), scaleY(veTrue), veLineCol, "ve")
		}
		return line
	}

	let veLineEl = addVELine()


	const veCCFunFull = (veInf, veSympt, p, v, sens, spec) => {
		let ve = getVE(veInf, veSympt)

		let pVac = p * (1 - ve)

		let vo = v * pVac
		let vn = v * (1 - pVac)
		let uo = (1 - v) * p
		let un = (1 - v) * (1 - p)

		let voMiss = vo * sens + vn * (1 - spec)
		let vnMiss = vn * spec + vo * (1 - sens)
		let uoMiss = uo * sens + un * (1 - spec)
		let unMiss = un * spec + uo * (1 - sens)

		let or = (voMiss * unMiss) / (vnMiss * uoMiss)
		let veCC = 1 - or
		return veCC
	}

	const veTNFunFull = (veInf, veSympt, p, v, sens, spec) => {
		let ve = getVE(veInf, veSympt)

		let pOther = 0.3
		let pVac = p * (1 - ve)

		let vo = v * pVac
		let vn = v * pOther
		let uo = (1 - v) * p
		let un = (1 - v) * pOther

		let voMiss = vo * sens + vn * (1 - spec)
		let vnMiss = vn * spec + vo * (1 - sens)
		let uoMiss = uo * sens + un * (1 - spec)
		let unMiss = un * spec + uo * (1 - sens)

		let or = (voMiss * unMiss) / (vnMiss * uoMiss)
		let veCC = 1 - or
		return veCC
	}

	let pUnvac = 0.1
	let vacCoverage = 0.4
	let sens = 1
	let spec = 1

	const veCCFunVEInf = (veInf) => veCCFunFull(veInf, veSympt, pUnvac, vacCoverage, sens, spec)
	const veCCFunP = (p) => veCCFunFull(veInf, veSympt, p, vacCoverage, sens, spec)

	const veTNFunVEInf = (veInf) => veTNFunFull(veInf, veSympt, pUnvac, vacCoverage, sens, spec)
	const veTNFunP = (p) => veTNFunFull(veInf, veSympt, p, vacCoverage, sens, spec)

	let xAxisSettings = {
		veInf: {
			veInfCCFun: veCCFunVEInf,
			veInfTNFun: veTNFunVEInf,
		},
		p: {
			veInfCCFun: veCCFunP,
			veInfTNFun: veTNFunP,
		}
	}

	let veCCLineCol = "#aaaaaa"
	let addVECCLine = () => {
		let line = addDomTo(
			plot, createLabelledFunLine, 0.001, 1,
			xAxisSettings[xlab].veInfCCFun, scaleX, scaleY, veCCLineCol, "ve(cc)"
		)
		return line
	}

	let veTNLineCol = "#ff69b4"
	let addVETNLine = () => {
		let line = addDomTo(
			plot, createLabelledFunLine, 0.001, 1,
			xAxisSettings[xlab].veInfTNFun, scaleX, scaleY, veTNLineCol, "ve(tn)"
		)
		return line
	}

	let veCCLineEl = addVECCLine()
	let veTNLineEl = addVETNLine()

	const redraw = () => {
		plot.removeChild(veLineEl)
		plot.removeChild(veCCLineEl)
		plot.removeChild(veTNLineEl)
		plot.removeChild(xlabEl)
		veLineEl = addVELine()
		veCCLineEl = addVECCLine()
		veTNLineEl = addVETNLine()
		xlabEl = addXLab()
	}

	const changeXLab = (newXLab) => {
		if (xlab !== newXLab && arrLinSearch(Object.keys(xAxisSettings), newXLab)) {
			xlab = newXLab
			redraw()
			for (let slider of Object.values(sliders)) {
				slider.style.background = "var(--color-background)"
			}
			sliders[newXLab].style.background = "var(--color-selected)"
		}
	}

	let slidersContainer = addDomDivTo(container)
	slidersContainer.style.display = "flex"
	slidersContainer.style.flexDirection = "row"
	slidersContainer.style.flexWrap = "wrap"

	let sliders = {}

	sliders["veInf"] = addDomTo(
		slidersContainer, createSlider, "veInf", veInf, 0.001, 1,
		(newVal) => { veInf = newVal; redraw() },
		() => { changeXLab("veInf"); }
	)

	sliders["veSympt"] = addDomTo(
		slidersContainer, createSlider, "veSympt", veSympt, 0.001, 1,
		(newVal) => { veSympt = newVal; redraw() },
		() => { changeXLab("veSympt"); }
	)

	sliders["p"] = addDomTo(
		slidersContainer, createSlider, "p", pUnvac, 0, 1,
		(newVal) => {pUnvac = newVal; redraw() },
		() => { changeXLab("p") }
	)

	sliders["sens"] = addDomTo(
		slidersContainer, createSlider, "sens", sens, 0.5, 1,
		(newVal) => { sens = newVal; redraw() },
	)

	sliders["spec"] = addDomTo(
		slidersContainer, createSlider, "spec", spec, 0.5, 1,
		(newVal) => { spec = newVal; redraw() },
	)

	sliders[xlab].style.background = "var(--color-selected)"

	return container
}

const addDomTo = (parent, createDom, ...args) => {
	let dom = createDom(...args)
	parent.appendChild(dom)
	return dom
}

const addDomDivTo = (parent) => addDomTo(parent, createDomDiv)

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
	currentSlide: 8,
	slides: [],
	slideState: [],
	slidePoints: [],
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
	let slideContent = addDomDivTo(slide)
	slideContent.style.display = "flex"
	slideContent.style.flexDirection = "column"
	slideContent.style.width = "90vw"
	slideContent.style.height = "90vh"
	let title = addDomTo(slideContent, createDomTitle, titleContent)
	title.style.marginBottom = "25px"
	let mainContent = addDomDivTo(slideContent)
	return mainContent
}

const addPointsToLastSlide = (parent, points) => {
	addDomTo(parent, createPoints, points, arrLast(globalState.slidePoints))
}

const addDomSlideWithTitleAndPoints = (title, points) => {
	let slide = addDomSlideWithTitle(title)
	addPointsToLastSlide(slide, points)
}

const switchToSlide = (index) => {
	index = clamp(index, 0, globalState.slides.length - 1)
	if (index !== globalState.currentSlide) {
		globalState.currentSlide = index
		removeChildren(globalState.domMain)
		globalState.domMain.appendChild(globalState.slides[globalState.currentSlide])
	}
}

const nextSlide = () => switchToSlide(globalState.currentSlide + 1)
const previousSlide = () => switchToSlide(globalState.currentSlide - 1)

const switchInSlide = (slideState) => {
	let slidePoints = globalState.slidePoints[globalState.currentSlide]
	slideState = clamp(slideState, 0, slidePoints.length)
	if (slideState !== globalState.slideState[globalState.currentSlide]) {
		for (let childIndex = 0; childIndex < slideState; childIndex += 1) {
			let child = slidePoints[childIndex]
			child.style.visibility = "visible"
		}
		for (let childIndex = slideState; childIndex < slidePoints.length; childIndex += 1) {
			let child = slidePoints[childIndex]
			child.style.visibility = "hidden"
		}
		globalState.slideState[globalState.currentSlide] = slideState
	}
}

const slideForward = () => switchInSlide(globalState.slideState[globalState.currentSlide] + 1)
const slideBack = () => switchInSlide(globalState.slideState[globalState.currentSlide] - 1)

// NOTE(sen) Title slide
{
	let slide = addDomSlide()
	let domTitleSubtitle = addDomTo(
		slide,
		createDomTitleSubtitle,
		"Theoretical framework for Retrospective Studies of the Effectiveness of SARS-CoV-2 Vaccines",
		"2022-03-23"
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
	addDomTo(slide, createTableClassic2x2)
	addPointsToLastSlide(slide, [
		"ro = vo / (vo + uo)",
		"rn = vn / (vn + un)",
	])
}

// NOTE(sen) Odds of vaccination
{
	let slide = addDomSlideWithTitle("Odds of vaccination")
	addDomTo(slide, createTableClassic2x2)
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
		"or = (1-ve)*(1-p) / (1-p*(1-ve))",
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
	let domTitleSubtitle = addDomTo(
		slide,
		createDomTitleSubtitle,
		"End of presentation",
		""
	)
}

// NOTE(sen) Init
{
	globalState.domMain.appendChild(globalState.slides[globalState.currentSlide])
	//window.onclick = nextSlide
	window.onkeydown = (e) => {
		switch (e.key) {
		case "ArrowRight": { nextSlide() } break;
		case "ArrowLeft": { previousSlide() } break;
		case "ArrowDown": { slideForward() } break;
		case "ArrowUp": { slideBack() } break;
		}
	}
}
