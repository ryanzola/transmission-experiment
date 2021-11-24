import * as THREE from 'three'
import MainThreeScene from './MainThreeScene'

export default class Bubble {
  constructor(_options) {
    this.experience = new MainThreeScene()
    this.scene = this.experience.scene
    this.background = this.experience.background
    this.time = this.experience.time
    this.count = 1000
    this.dummy = new THREE.Object3D()
    this.amount = () => Math.random() * 40 - 20

    this.clean()

    this.setGeometry()
    this.setTexture()
    this.setMaterial()
    this.setInstancedMesh()
  }



  setGeometry() {
    this.geometry = new THREE.SphereGeometry( 1, 64, 32 );
  }

  setTexture() {
    const elCanvas = document.createElement('canvas')
    elCanvas.width = 2
    elCanvas.height = 2

    const context = elCanvas.getContext('2d')
    context.fillStyle = "white"
    context.fillRect(0, 1, 2, 1)

    this.texture = new THREE.CanvasTexture(elCanvas)
    this.texture.magFilter = THREE.NearestFilter
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping
    this.texture.repeat.set(1, 3.5)
  }

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      ior: 1.5,
      // alphaMap: this.texture,
      envMap: this.background,
      envMapIntensity: 1,
      transmission: 1,
      specularIntensity: 1,
      specularColor: 0xffffff,
      opacity: 1,
      side: THREE.DoubleSide,
      transparent: true
    })
  }

  setInstancedMesh() {
    this.matrix = new THREE.Matrix4()
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count)

    for(let i = 0; i < this.count; i++) {
      this.position = new THREE.Vector3()
      this.rotation = new THREE.Euler()
      this.quaternion = new THREE.Quaternion()
      this.scale = new THREE.Vector3()

      this.position.x = Math.random() * 40 - 20
      this.position.y = Math.random() * 60 - 30
      this.position.z = Math.random() * 40 - 20

      this.rotation.x = this.rotation.y = this.rotation.z = 0

      this.quaternion.setFromEuler(this.rotation)

      this.scale.x = this.scale.y = this.scale.z = Math.random() * 1

      this.matrix.compose(this.position, this.quaternion, this.scale)
      this.mesh.setMatrixAt(i, this.matrix)
    }

    this.scene.add(this.mesh)
  }

  update() {

    // this.dummy.position.set(this.amount, this.amount, this.amount)
    // this.dummy.position.y += this.time.delta * 0.00000001

    // if(this.dummy.position.y > 20) this.dummy.position.y = - 20

    for(let i = 0; i < this.count; i++) {
      this.mesh.getMatrixAt(i, this.matrix)
      this.position.setFromMatrixPosition(this.matrix)
      this.position.y += 0.1


      if(this.position.y > 30) this.position.y = -30


      this.matrix.setPosition(this.position)
      this.mesh.setMatrixAt(i, this.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true
  }

  clean() {
    const meshes = []

    this.scene.traverse(child => {
      if(child.isMesh) meshes.push(child)
    })

    for(let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i]

      mesh.material.dispose()
      mesh.geometry.dispose()

      this.scene.remove(mesh)
    }
  }
}