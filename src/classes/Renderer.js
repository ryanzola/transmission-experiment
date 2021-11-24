import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

import MainThreeScene from './MainThreeScene'

export default class Renderer {
  constructor(_options) {
    this.bind()

    this.experience = new MainThreeScene()
    this.scene = this.experience.scene
    this.config = this.experience.config
    this.stats = this.experience.stats
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera

    this.usePostprocess = false

    if(this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: 'Renderer'
      })
    }

    this.setInstance()
    this.setPostProcess()
  }

  setInstance() {
    this.clearColor = '#160f11'

    if(this.debug) {
        this.debugFolder.addInput(
            this,
            'clearColor'
        )
        .on('change', () => {
            this.instance.setClearColor(this.clearColor)
        })
    }

    // Renderer
    this.instance = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true
    })
    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = 0
    this.instance.domElement.style.left = 0
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    // this.instance.setClearColor(0x414141, 1)
    this.instance.setClearColor(this.clearColor, 1)
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    // this.instance.physicallyCorrectLights = true
    // this.instance.gammaOutPut = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.shadowMap.enabled = true
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1

    this.context = this.instance.getContext()

    // add stats panel
    if(this.stats) {
      this.stats.setRenderPanel(this.context)
    }
  }

  setPostProcess() {
    this.postProcess = {}

    // render target
    const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
    // const RenderTargetClass = THREE.WebGLRenderTarget
    const renderTarget = new RenderTargetClass(
        this.config.width,
        this.config.height,
        {
            generateMipmaps: false,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            encoding: THREE.sRGBEncoding
        }
    )

    // effect composer
    this.postProcess.composer = new EffectComposer(this.instance, renderTarget)

    // passes
    this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

    // add passes
    this.postProcess.composer.addPass(this.postProcess.renderPass)
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    // Post process
    this.postProcess.composer.setSize(this.config.width, this.config.height)
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
  }

  update() {
    if(this.stats) {
      this.stats.beforeRender()
    }

    if(this.usePostprocess) {
      this.postProcess.composer.render()
    }
    else {
      this.instance.render(this.scene, this.camera.instance)
    }

    if(this.stats) {
      this.stats.afterRender()
    }
  }

  destroy() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.renderTarget.dispose()
    this.postProcess.composer.renderTarget1.dispose()
    this.postProcess.composer.renderTarget2.dispose()
  }

  bind() {
    this.resize = this.resize.bind(this)
    this.update = this.update.bind(this)
    this.destroy = this.destroy.bind(this)
  }
}