# Lofi Website Performance Optimization Prompt

## 🚨 Critical Performance Issues Identified

### Network Analysis Results:
- **Total Load Time**: 46.13 seconds
- **Total Transferred**: 22,892 kB (23MB)
- **Primary Bottleneck**: Large media files (7MB+ individual videos)
- **Resource Count**: 25+ requests with heavy media loading

### Specific Performance Problems:
1. **ExteriorRainyDay.mp4**: 7,090 kB - 36.27s load time
2. **ExteriorRainyNight.mp4**: 6,980 kB - 44.30s load time
3. **InteriorRainyNight.mp4**: 1,956 kB - 42.60s load time
4. **Multiple MP3 files**: 97-131 kB each, loading simultaneously
5. **WebP images**: 35-146 kB, delayed by media loading

## 🎯 Optimization Requirements

### 1. Media File Compression (HIGHEST PRIORITY)
**Target**: Reduce video files from 7MB to 1-2MB (70-80% reduction)

**Implementation:**
```bash
# Compress existing MP4 files
ffmpeg -i ExteriorRainyDay.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k ExteriorRainyDay_compressed.mp4
ffmpeg -i ExteriorRainyNight.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k ExteriorRainyNight_compressed.mp4
ffmpeg -i InteriorRainyNight.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k InteriorRainyNight_compressed.mp4
```

**Alternative: Convert to WebM for better compression**
```bash
ffmpeg -i ExteriorRainyDay.mp4 -c:v libvpx-vp9 -crf 30 -c:a libopus ExteriorRainyDay.webm
```

### 2. Lazy Loading Implementation (HIGH PRIORITY)
**Target**: Load media only when needed, not on initial page load

**Implementation:**
```javascript
// React component with lazy loading
const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
const [isUserInteracted, setIsUserInteracted] = useState(false);

useEffect(() => {
  // Load media after user interaction or delayed
  const timer = setTimeout(() => {
    setShouldLoadMedia(true);
  }, 2000); // 2 second delay

  return () => clearTimeout(timer);
}, []);

// Only render heavy media when needed
{shouldLoadMedia && (
  <video src="ExteriorRainyDay_compressed.mp4" />
)}
```

### 3. Progressive Loading Strategy (MEDIUM PRIORITY)
**Target**: Load critical content first, media later

**Implementation:**
```javascript
// Load in phases
const [loadPhase, setLoadPhase] = useState('critical'); // 'critical' | 'media' | 'complete'

useEffect(() => {
  // Phase 1: Load critical UI and basic audio
  setLoadPhase('critical');
  
  // Phase 2: Load media after delay
  setTimeout(() => {
    setLoadPhase('media');
  }, 1000);
  
  // Phase 3: Complete loading
  setTimeout(() => {
    setLoadPhase('complete');
  }, 3000);
}, []);
```

### 4. Resource Hints and Preloading (MEDIUM PRIORITY)
**Target**: Optimize resource loading order

**Implementation:**
```html
<!-- Add to <head> section -->
<link rel="preload" href="critical-audio.mp3" as="audio">
<link rel="preload" href="ui-assets.css" as="style">
<link rel="preload" href="main-app.js" as="script">
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

### 5. Audio Streaming Implementation (LOW PRIORITY)
**Target**: Stream audio instead of full file downloads

**Implementation:**
```javascript
// Use audio streaming for better performance
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffer = await audioContext.decodeAudioData(audioData);

// Implement audio streaming with chunks
const streamAudio = async (url) => {
  const response = await fetch(url);
  const reader = response.body.getReader();
  // Process audio in chunks
};
```

## 📊 Performance Targets

### Current State:
- ❌ 46.13 seconds total load time
- ❌ 23MB transferred
- ❌ 7MB individual video files
- ❌ All media loads simultaneously

### Target State:
- ✅ 5-10 seconds total load time (80% reduction)
- ✅ 5-8MB transferred (70% reduction)
- ✅ 1-2MB individual video files
- ✅ Progressive loading with lazy loading

## 🔧 Technical Implementation Details

### File Structure Optimization:
```
public/
├── media/
│   ├── compressed/          # Compressed video files
│   │   ├── ExteriorRainyDay_compressed.mp4
│   │   ├── ExteriorRainyNight_compressed.mp4
│   │   └── InteriorRainyNight_compressed.mp4
│   ├── webm/               # WebM format for better compression
│   │   ├── ExteriorRainyDay.webm
│   │   └── ExteriorRainyNight.webm
│   └── audio/              # Compressed audio files
│       ├── sleepy_4_compressed.mp3
│       └── other_audio_compressed.mp3
```

### React Component Optimization:
```javascript
// Optimized media loading component
const OptimizedMediaPlayer = ({ src, type = 'video' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    // Lazy load media
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!shouldLoad) {
    return <div className="media-placeholder">Loading...</div>;
  }
  
  return (
    <div className="media-container">
      {type === 'video' ? (
        <video 
          src={src} 
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      ) : (
        <audio 
          src={src} 
          onLoad={() => setIsLoaded(true)}
          preload="none"
        />
      )}
    </div>
  );
};
```

### Build Configuration Optimization:
```javascript
// webpack.config.js or vite.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        media: {
          test: /\.(mp4|webm|mp3)$/,
          name: 'media',
          chunks: 'async',
          priority: 10
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(mp4|webm)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'media/compressed/'
            }
          }
        ]
      }
    ]
  }
};
```

## 🎯 Implementation Priority Order

### Phase 1: Immediate Impact (Week 1)
1. **Compress all video files** using ffmpeg
2. **Implement lazy loading** for media components
3. **Add resource hints** to HTML head

### Phase 2: Medium Impact (Week 2)
1. **Convert to WebM format** for better compression
2. **Implement progressive loading** strategy
3. **Optimize bundle splitting** for media files

### Phase 3: Advanced Optimization (Week 3)
1. **Implement audio streaming**
2. **Add service worker caching**
3. **Mobile-specific optimizations**

## 📈 Success Metrics

### Performance Benchmarks:
- **Load Time**: < 10 seconds (from 46s)
- **File Size**: < 8MB total (from 23MB)
- **Individual Videos**: < 2MB each (from 7MB)
- **Time to Interactive**: < 3 seconds

### User Experience Metrics:
- **First Contentful Paint**: < 2 seconds
- **Largest Contentful Paint**: < 5 seconds
- **Cumulative Layout Shift**: < 0.1

## 🔍 Testing and Validation

### Performance Testing:
```bash
# Test compressed files
curl -I https://your-lofi-site.com/media/compressed/ExteriorRainyDay_compressed.mp4

# Lighthouse audit
lighthouse https://your-lofi-site.com --output html --output-path ./lighthouse-report.html

# WebPageTest
# Use webpagetest.org to test from multiple locations
```

### Browser Testing:
- Chrome DevTools Network tab
- Firefox Network Monitor
- Safari Web Inspector
- Mobile device testing

## 📝 Implementation Checklist

### Media Optimization:
- [ ] Compress all MP4 files using ffmpeg
- [ ] Convert to WebM format for better compression
- [ ] Optimize audio files (MP3 compression)
- [ ] Implement lazy loading for media components
- [ ] Add progressive loading strategy

### Code Optimization:
- [ ] Implement React lazy loading
- [ ] Add resource hints to HTML head
- [ ] Optimize bundle splitting
- [ ] Add service worker for caching
- [ ] Implement error handling for media loading

### Testing and Validation:
- [ ] Test on multiple devices and browsers
- [ ] Validate performance improvements
- [ ] Check iframe loading in portfolio website
- [ ] Monitor real user performance metrics

## 🚀 Expected Results

After implementing these optimizations, your lofi website should:

1. **Load 80% faster** in the iframe
2. **Transfer 70% less data**
3. **Provide better user experience** with progressive loading
4. **Work seamlessly** in the portfolio iframe
5. **Maintain audio/video quality** while reducing file sizes

This optimization will significantly improve the iframe loading performance in your Three.js portfolio website. 