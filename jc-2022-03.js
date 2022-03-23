"use strict"

const clamp = (val, min, max) => val < min ? min : val > max ? max : val

const arrLast = (arr) => arr[arr.length - 1]

const createDomDiv = () => document.createElement("div")

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

const createTableClassic2x2 = () => {
	let table = createTableFromRows([
		["", "Outcome", "No Outcome"],
		["Vaccinated", "vo", "vn"],
		["Unvaccinated", "uo", "un"],
	])
	table.style.marginBottom = "50px"
	return table
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
	currentSlide: 5,
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

// NOTE(sen) OR properties
{
	
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
