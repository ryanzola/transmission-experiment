import * as THREE from 'three'

import MainThreeScene from './MainThreeScene'

export default class Camera {
  constructor(_options) {
      this.experience = new MainThreeScene()
      this.config = this.experience.config
      this.scene = this.experience.scene

      this.bind()
      this.setInstance()

  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(70, this.config.width / this.config.height, 1, 2000)
    this.instance.rotation.reorder('YXZ')

    this.scene.add(this.instance)
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height
    this.instance.updateProjectionMatrix()
  }

  update() {

  }

  destroy() {

  }

  bind() {
    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)
    this.destroy = this.destroy.bind(this)
  }
}