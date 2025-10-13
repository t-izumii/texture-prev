import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useRef, useEffect } from 'react'
import "./webgl.css"

function Sphere({ texture }: { texture: THREE.Texture | null }) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.map = texture
      materialRef.current.color.set(texture ? 0xffffff : 0x00ff88)  // ← 追加！
      materialRef.current.needsUpdate = true
    }
  }, [texture])
  
  return (
    <mesh>
      <sphereGeometry args={[5, 64, 64]} />
      <meshBasicMaterial 
        ref={materialRef}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Webgl() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type)
      
      const reader = new FileReader()
      
      reader.onload = (e) => {
        console.log('File read complete')
        const image = new Image()
        
        image.onload = () => {
          console.log('Image loaded, size:', image.width, 'x', image.height)
          const newTexture = new THREE.Texture(image)
          newTexture.needsUpdate = true
          newTexture.colorSpace = THREE.SRGBColorSpace  // 色空間を設定
          setTexture(newTexture)
          console.log('Texture created and set:', newTexture)
        }
        
        image.onerror = (err) => {
          console.error('Image load error:', err)
        }
        
        image.src = e.target?.result as string
      }
      
      reader.onerror = (err) => {
        console.error('FileReader error:', err)
      }
      
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload}
          style={{ color: 'white' }}
        />
        {texture && (
          <div style={{ color: 'white', marginTop: '10px', fontSize: '12px' }}>
            ✓ テクスチャ適用済み
          </div>
        )}
      </div>

      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <Sphere texture={texture} />
        <OrbitControls />
      </Canvas>
    </>
  )
}

export default Webgl