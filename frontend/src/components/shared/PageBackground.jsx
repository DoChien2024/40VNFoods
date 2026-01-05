import { memo } from 'react'

const PageBackground = memo(({ imageUrl, overlayType = 'dark' }) => {
  const overlayClass = overlayType === 'darker' ? 'overlay-darker' : 'overlay-dark'
  
  return (
    <div 
      className="fixed inset-0 z-0 w-full h-full"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className={overlayClass} />
    </div>
  )
})

PageBackground.displayName = 'PageBackground'

export default PageBackground
