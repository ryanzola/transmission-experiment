import * as THREE from "three"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { Pane } from 'tweakpane'

import Camera from './Camera'
import Renderer from './Renderer'
import Controls from './Controls'

import Bubble from "./Bubble";

import RAF from '../utils/RAF'
import Sizes from '../utils/Sizes'
import Stats from '../utils/Stats'
import Time from '../utils/Time'

export default class MainThreeScene {
	static instance

	constructor(_options) {
		if(MainThreeScene.instance) {
			return MainThreeScene.instance
		}

		MainThreeScene.instance = this
		
		this.targetElement = _options.targetElement
		
		
		if(!this.targetElement) {
			console.warn('Missing \'targetElement\' property')
			return
		}
		
		this.time = new Time()
		this.sizes = new Sizes()

		this.background = new RGBELoader()
			.setPath('/assets/img/equirectangular/')
			.load('royal_esplanade.hdr', () => {
				this.background.mapping = THREE.EquirectangularReflectionMapping;

			})
			this.bind()
			this.setConfig()
			this.setStats()
			this.setDebug()
			this.setScene()
			this.setCamera()
			this.setRenderer()
			this.setControls()
	
			this.setBubble()

			//RENDER LOOP AND WINDOW SIZE UPDATER SETUP
			this.sizes.on('resize', () => {
				this.resize()
			})

			RAF.subscribe('threeSceneUpdate', this.update)
	}

	setConfig() {
		this.config = {}

		// debug
		this.config.debug = window.location.hash === '#debug'

		// pixel ratio
		this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

		//dimensions
		const boundings = this.targetElement.getBoundingClientRect()
		this.config.width = boundings.width;
		this.config.height = boundings.height || window.innerHeight;
	}

	setStats() {
		if(this.config.debug) {
			this.stats = new Stats(true)
		}
	}

	setDebug() {
		if(this.config.debug) {
			this.debug = new Pane()
			this.debug.containerElem_.style.width = '320px'
		}
	}

	setScene() {
		this.scene = new THREE.Scene()
		this.scene.background = this.background
	}

	setCamera() {
		this.camera = new Camera()
		this.camera.instance.position.set(0, 0, 30)
	}

	setRenderer() {
		this.renderer = new Renderer()
		this.targetElement.appendChild(this.renderer.instance.domElement)
	}

	setControls() {
		this.controls = new Controls()
	}

	setBubble() {
		this.bubble = new Bubble();
	}

	update() {
		if(this.stats)
			this.stats.update()

		if(this.renderer)
			this.renderer.update()

		if(this.camera)
			this.camera.update()

		if(this.controls)
			this.controls.update()

		if(this.bubble)
			this.bubble.update()
	}

	resize() {
		const boundings = this.targetElement.getBoundingClientRect()
		this.config.width = boundings.width
		this.config.height = boundings.height || window.innerHeight
		this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

		if(this.camera)
			this.camera.resize()

		if(this.renderer) {
			this.renderer.resize()
		}
	}

	destroy() {
		if(this.camera)
			this.camera.destroy()

		if(this.renderer)
			this.renderer.destroy()

		if(this.controls)
			this.controls.destroy()
	}

	bind() {
		this.resize = this.resize.bind(this)
		this.update = this.update.bind(this)
	}
}