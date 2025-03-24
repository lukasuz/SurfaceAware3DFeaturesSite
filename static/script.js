const all_videos = []
const all_zoomed = new Map();

class VideoHandler {
    constructor(video_id, p_id, n_id, max_num, crrnt_num, folder) {
        this.video = document.getElementById(video_id);
        this.source = this.video.querySelector('source');
        this.p = document.getElementById(p_id);
        this.n = document.getElementById(n_id);
        this.max_num = max_num;
        this.crrnt_num = crrnt_num;
        this.folder = folder;

        this.n.addEventListener('click', (event) => {
            this.crrnt_num = (this.crrnt_num + 1) % this.max_num;
            this.change_video();
        });

        this.p.addEventListener('click', (event) => {
            this.crrnt_num = ((this.crrnt_num - 1 + this.max_num) % this.max_num);
            this.change_video();
        });
    }
    get_path() {
        console.log(this.folder);
        let path = this.folder + this.crrnt_num + ".mp4";
        console.log(path);
        return path;
    }
    change_video() {
        let path = this.get_path();
        
        // Fix video size while loading
        let height = this.video.clientHeight;
        let width = this.video.clientWidth;

        this.video.setAttribute('height', height);
        this.video.setAttribute('width', width);

        this.source.setAttribute('src', path);
        this.video.load();
        this.video.play();

        // Reset playing state to true for the associated stop button.
        // Assumes stop button id is the video id with 'video' replaced by 'S'
        const stopButtonId = this.video.id.replace('video', 'S');
        if (videoState && videoState[stopButtonId]) {
            videoState[stopButtonId].playing = true;
        }

        // Once loaded, remove fixed video size
        this.video.onloadeddata = () => {
            this.video.removeAttribute('height');
            this.video.removeAttribute('width');
        }
    }
}


const videoState = {};

function setupVideoZoom(videoId, buttonId) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    if (!videoState[buttonId]) {
      videoState[buttonId] = { zoomed: false, playing: true };
    }
    video.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  
    button.addEventListener('click', () => {
      const state = videoState[buttonId];
  
      if (!state.zoomed) {
        // Simulate a click on all other zoomed videos to unzoom them
        for (const otherButtonId in videoState) {
          if (otherButtonId !== buttonId && videoState[otherButtonId].zoomed) {
            document.getElementById(otherButtonId).click();
          }
        }
        const currentWidth = video.clientWidth;
        const viewportWidth = window.innerWidth;
        const scaleFactor = 0.98 * (viewportWidth / currentWidth);
        video.style.transform = `scale(${scaleFactor})`;
        video.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        video.style.borderRadius = '5px';
        video.style.backgroundColor = 'white';
        video.style.position = 'relative';
        video.style.zIndex = '9999';
      } else {
        video.style.transform = '';
        video.style.boxShadow = '';
        video.style.position = '';
        video.style.zIndex = '';
      }
      state.zoomed = !state.zoomed;
    });
  }
  
  // Add a global keydown listener to disable zoom on Escape press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      for (const buttonId in videoState) {
        if (videoState[buttonId].zoomed) {
          document.getElementById(buttonId).click();
        }
      }
    }
  });
  
  

function setupStop(videoId, buttonId) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  // Initialize state if not exists
  if (!videoState[buttonId]) {
    videoState[buttonId] = { zoomed: false, playing: true };
  }
  video.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

  button.addEventListener('click', () => {
    const state = videoState[buttonId];
    if (state.playing) {
      video.pause();
    } else {
      video.play();
    }
    state.playing = !state.playing;
  });
}

window.addEventListener("load", () => {
  new VideoHandler(
    "shrec19-video",
    "shrec19-P",
    "shrec19-N",
    44,
    4,
    "./static/videos/shrec19/"
  );

  new VideoHandler(
    "tosca-video",
    "tosca-P",
    "tosca-N",
    41,
    23,
    "./static/videos/tosca/"
  );

  new VideoHandler(
    "shrec20-video",
    "shrec20-P",
    "shrec20-N",
    13,
    12,
    "./static/videos/shrec20/"
  );

  new VideoHandler(
    "pose-video",
    "pose-P",
    "pose-N",
    10,
    3,
    "./static/videos/pose/"
  );

  new VideoHandler(
    "motion-video",
    "motion-P",
    "motion-N",
    3,
    1,
    "./static/videos/motion/"
  );

  new VideoHandler(
    "segmentation-video",
    "segmentation-P",
    "segmentation-N",
    3,
    0,
    "./static/videos/segmentation/"
  );

  setupVideoZoom('segmentation-box', 'segmentation-Z');
  setupVideoZoom('pose-box', 'pose-Z');
  setupVideoZoom('motion-box', 'motion-Z');
  setupVideoZoom('shrec19-box', 'shrec19-Z');
  setupVideoZoom('shrec20-box', 'shrec20-Z');
  setupVideoZoom('tosca-box', 'tosca-Z');
  setupVideoZoom('teaser-box', 'teaser-Z');

  setupStop('segmentation-video', 'segmentation-S');
  setupStop('pose-video', 'pose-S');
  setupStop('motion-video', 'motion-S');
  setupStop('shrec19-video', 'shrec19-S');
  setupStop('shrec20-video', 'shrec20-S');
  setupStop('tosca-video', 'tosca-S');
});
