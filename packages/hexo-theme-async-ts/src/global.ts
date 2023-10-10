import { utils } from './utils'

/**
 * 执行页面切换动画
 * @param wait
 * @returns
 */
const pageLoading = function (wait: number = 600): Promise<void> {
	return new Promise((resolve) => {
		utils.q('html').classList.add('is-animating')
		utils.q<HTMLDivElement>('.trm-scroll-container').style.opacity = '0'
		setTimeout(function () {
			utils.q('html').classList.remove('is-animating')
			utils.q<HTMLDivElement>('.trm-scroll-container').style.opacity = '1'
			resolve()
		}, wait)
	})
}

/**
 * 执行主题切换动画
 * @param wait
 * @returns
 */
const themeLoading = function (wait: number = 600): Promise<void> {
	/* Content area */
	const scroll_container = utils.q<HTMLDivElement>('#trm-scroll-container')
	/* Animated mask layers */
	const mode_swich_animation_frame = utils.q<HTMLDivElement>('.trm-mode-swich-animation-frame')

	return new Promise<void>((resolve) => {
		/* Start to switch theme animation */
		mode_swich_animation_frame.classList.add('trm-active')
		scroll_container.style.opacity = '0'
		setTimeout(() => {
			/* End switch theme animation */
			setTimeout(() => {
				mode_swich_animation_frame.classList.remove('trm-active')
				scroll_container.style.opacity = '1'
			}, wait)
			resolve()
		}, wait)
	})
}

/**
 * 切换单双栏
 */
const switchSingleColumn = function () {
	document.body.classList.toggle('trm-single-column')
}

/**
 * 阅读模式切换
 */
const switchReadMode = function () {
	const $body = document.body
	$body.classList.add('trm-read-mode')
	const newEle = document.createElement('button')
	newEle.type = 'button'
	newEle.title = window.ASYNC_CONFIG.i18n.exit_read_mode
	newEle.className = `trm-exit-readmode trm-glow`
	newEle.innerHTML = utils.icons(window.ASYNC_CONFIG.icons.close, window.ASYNC_CONFIG.icontype)
	$body.appendChild(newEle)

	function clickFn() {
		$body.classList.remove('trm-read-mode')
		newEle.removeEventListener('click', clickFn)
		newEle.remove()
	}

	newEle.addEventListener('click', clickFn)
}

/**
 * 主题切换
 * @param type
 */
const switchThemeMode = function (type: 'style-dark' | 'style-light') {
	themeLoading().then(() => {
		const fun = type === 'style-dark' ? 'add' : 'remove'
		utils.q('.trm-mode-swich-animation').classList[fun]('trm-active')
		document.documentElement.classList[fun]('dark')

		localStorage.setItem('theme-mode', type)
		setThemeColor()

		// 适配 Giscus
		typeof window.changeGiscusTheme === 'function' && window.changeGiscusTheme()
	})
}

/**
 * 设置移动端-状态栏主题
 * @param colorVal
 */
const setThemeColor = function (colorVal = '--theme-bg-color') {
	let themeColor = getComputedStyle(document.documentElement).getPropertyValue(colorVal)
	let themeColorDom = utils.q<HTMLMetaElement>('meta[name="theme-color"]')
	if (themeColor && themeColorDom) {
		themeColorDom.content = themeColor
	}
}

/**
 * 显示 Toc 面板
 * @param show
 * @param x
 * @param y
 */
const switchToc = function (show?: boolean, x?: number, y?: number) {
	const postToc = utils.q<HTMLElement>('#post-toc')
	if (postToc && !postToc.classList.contains('fixed')) {
		if (show === undefined) {
			show = !postToc.classList.contains('active')
		}

		if (show) {
			if (x && y) {
				if (y + postToc.clientHeight > window.innerHeight) {
					y = Math.max(window.innerHeight - postToc.clientHeight, 0)
				}
				if (x + postToc.clientWidth > window.innerWidth) {
					x = Math.max(window.innerWidth - postToc.clientWidth, 0)
				}

				postToc.style.left = `${x}px`
				postToc.style.top = `${y}px`
				postToc.style.right = 'unset'
				postToc.style.bottom = 'unset'
			} else {
				postToc.style.removeProperty('left')
				postToc.style.removeProperty('top')
				postToc.style.removeProperty('right')
				postToc.style.removeProperty('bottom')
			}
		}

		show ? postToc.classList.add('active') : postToc.classList.remove('active')
	}
}

export default {
	pageLoading,
	themeLoading,
	switchSingleColumn,
	switchReadMode,
	switchThemeMode,
	setThemeColor,
	switchToc,
}
