document.addEventListener("DOMContentLoaded", () => {
  // ===== Lenis 平滑惯性滚动 =====
  const lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const serviceRows = document.querySelectorAll(".service-row");
  const menuLinks = document.querySelectorAll(".menu-links button");

  console.log("Found menu links:", menuLinks.length);
  menuLinks.forEach((link, i) => {
    console.log(`Link ${i}:`, link.textContent, "- has data-text:", !!link.dataset.text);
  });
  
  // 特别检查 ABOUT 按钮
  const aboutBtn = document.querySelector('.hero-nav-col-left button');
  console.log("About button:", aboutBtn);
  console.log("About button textContent:", aboutBtn?.textContent);
  console.log("About button dataset:", aboutBtn?.dataset);

  // ===== 鼠标轨迹 Canvas 效果 =====
  const canvas = document.getElementById('mouse-trail-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // 轨迹点数组
    const trail = [];
    const maxTrailLength = 50;
    const fadeSpeed = 0.02;
    
    // 鼠标位置
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
    
    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // 计算移动距离，添加轨迹点
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        // 在移动路径上插值添加轨迹点
        const steps = Math.floor(distance / 5);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          trail.push({
            x: lastMouseX + dx * t,
            y: lastMouseY + dy * t,
            size: 60 + Math.random() * 40, // 60-100px，增大晕染范围
            opacity: 1,
            age: 0
          });
        }
        
        // 限制轨迹点数量
        if (trail.length > maxTrailLength) {
          trail.splice(0, trail.length - maxTrailLength);
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    });
    
    // 初始化鼠标位置
    document.addEventListener('mouseenter', (e) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    
    // 动画循环
    function animate() {
      // 清除画布
      ctx.clearRect(0, 0, width, height);
      
      // 设置混合模式为 lighter 实现叠加发光
      ctx.globalCompositeOperation = 'lighter';
      
      // 绘制每个轨迹点
      for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i];
        
        // 更新透明度和年龄
        point.opacity -= fadeSpeed;
        point.age += fadeSpeed;
        
        // 移除完全透明的点
        if (point.opacity <= 0) {
          trail.splice(i, 1);
          continue;
        }
        
        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size
        );
        
        // 渐变配色：#1425B1 主题色，只在边缘弥散
        gradient.addColorStop(0, `rgba(20, 37, 177, ${point.opacity * 0.8})`); // #1425B1 中心
        gradient.addColorStop(0.7, `rgba(20, 37, 177, ${point.opacity * 0.5})`); // #1425B1 保持
        gradient.addColorStop(1, `rgba(20, 37, 177, 0)`); // 边缘弥散透明
        
        // 绘制光晕
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // 重置混合模式
      ctx.globalCompositeOperation = 'source-over';
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // 服务图片数组 - 每个服务对应的图片（统一尺寸 w=900&q=80）
  const serviceImages = [
    "https://images.prismic.io/oci-awards/aYeO490YXLCxVj7n_mg-6-.png?auto=format,compress&w=900&q=80",
    "https://images.prismic.io/oci-awards/aYeO790YXLCxVj7t_ESB.jpg?auto=format,compress&w=900&q=80",
    "https://images.prismic.io/oci-awards/aYeOzd0YXLCxVj7c_ExpertConsultation.jpg?auto=format,compress&w=900&q=80",
    "https://images.prismic.io/oci-awards/aYeOP90YXLCxVj6Q_Commercial-Building-NYC.jpeg?auto=format,compress&w=900&q=80",
    "https://images.prismic.io/oci-awards/aYeOud0YXLCxVj7N_ebike.jpg?auto=format,compress&w=900&q=80",
    "https://images.prismic.io/oci-awards/aYePB90YXLCxVj72_adrien-olichon-_UuN_2ixJvA-unsplash.jpg?auto=format,compress&w=900&q=80"
  ];
  
  const currentImage = document.getElementById('service-image-current');
  const nextImage = document.getElementById('service-image-next');
  let currentImageIndex = 0;

  serviceRows.forEach((row) => {
    const button = row.querySelector(".service-toggle");

    button?.addEventListener("click", () => {
      const isOpen = row.classList.contains("is-open");
      
      if (isOpen) {
        // 点击已展开的项，直接收回
        row.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      } else {
        // 点击新项，同时展开新项和收回旧项
        const currentlyOpen = document.querySelector('.service-row.is-open');
        
        // 先收回当前展开的（如果有）
        if (currentlyOpen) {
          currentlyOpen.classList.remove("is-open");
          currentlyOpen.querySelector(".service-toggle")?.setAttribute("aria-expanded", "false");
        }
        
        // 同时展开新项
        row.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        
        // 切换对应的图片（渐变效果）
        const serviceIndex = parseInt(row.getAttribute('data-service'));
        if (serviceIndex !== currentImageIndex && currentImage && nextImage) {
          const newImageSrc = serviceImages[serviceIndex];
          
          nextImage.src = newImageSrc;
          nextImage.classList.remove('active');
          currentImage.classList.remove('active');
          
          requestAnimationFrame(() => {
            nextImage.classList.add('active');
          });
          
          setTimeout(() => {
            currentImage.src = newImageSrc;
            currentImage.classList.add('active');
            nextImage.classList.remove('active');
            currentImageIndex = serviceIndex;
          }, 400);
        }
      }
    });
  });

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (!button.classList.contains("service-toggle") && !button.classList.contains("corner-cta")) {
        event.preventDefault();
      }
    });
  });

  // 顶部导航 contact 按钮点击展开 menu
  const cornerCta = document.querySelector(".corner-cta");
  const navMenuSlider = document.querySelector(".nav-menu-slider");
  
  if (cornerCta && navMenuSlider) {
    cornerCta.addEventListener("click", () => {
      navMenuSlider.classList.toggle("is-open");
    });
  }

  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const runScramble = (node) => {
    const finalText = node.dataset.text !== undefined ? node.dataset.text : (node.textContent || "");
    let frame = 0;

    window.clearInterval(node._scrambleTimer);

    node._scrambleTimer = window.setInterval(() => {
      const output = finalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < frame) return finalText[index];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("");

      node.textContent = output;
      frame += 1;

      if (frame > finalText.length) {
        window.clearInterval(node._scrambleTimer);
        node.textContent = finalText;
      }
    }, 26);
  };

  menuLinks.forEach((node, index) => {
    // 强制设置 data-text
    const originalText = node.textContent.trim();
    node.setAttribute('data-text', originalText);
    
    console.log(`Link ${index}: "${originalText}" - data-text set to: "${node.getAttribute('data-text')}"`);

    node.addEventListener("mouseenter", (e) => {
      console.log("Mouse entered:", originalText, "event:", e.target.textContent);
      runScramble(node);
    });

    node.addEventListener("focus", () => {
      runScramble(node);
    });
  });

  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty("--glow-x", `${x}%`);
    document.documentElement.style.setProperty("--glow-y", `${y}%`);
  });

  // ===== 滚动检测：导航菜单固定，滚动时乱码消失/出现 =====
  const heroNav = document.querySelector(".hero-nav");
  let isNavVisible = true;
  const TRIGGER_OFFSET = 50; // 离顶部50pt触发
  
  if (heroNav && navMenuSlider) {
    // 获取左右两列的导航链接
    const leftLinks = document.querySelectorAll(".hero-nav-col-left button");
    const rightLinks = document.querySelectorAll(".hero-nav-col-right button");
    
    // 使用 scroll 事件监听滚动
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      
      // 当滚动超过50pt时，导航以乱码效果消失（从底行往上）
      if (scrollY > TRIGGER_OFFSET && isNavVisible) {
        isNavVisible = false;
        
        // 左列从底行(CONTACT)往上消失
        const leftArray = Array.from(leftLinks).reverse(); // 反转数组，从底行开始
        leftArray.forEach((link, index) => {
          setTimeout(() => {
            scrambleOut(link);
          }, index * 80);
        });
        
        // 右列从底行(CLIENTS)往上消失
        const rightArray = Array.from(rightLinks).reverse(); // 反转数组，从底行开始
        rightArray.forEach((link, index) => {
          setTimeout(() => {
            scrambleOut(link);
          }, index * 80);
        });
        
        // 隐藏导航栏
        setTimeout(() => {
          heroNav.classList.add("is-hidden");
        }, 400);
        
        // 自动展开右上角 menu
        navMenuSlider.classList.add("is-open");
      }
      
      // 当滚动回到50pt以内时，导航重新出现（从上往下）
      if (scrollY <= TRIGGER_OFFSET && !isNavVisible) {
        isNavVisible = true;
        
        // 显示导航栏
        heroNav.classList.remove("is-hidden");
        
        // 左列从顶行(ABOUT)往下出现
        leftLinks.forEach((link, index) => {
          setTimeout(() => {
            scrambleIn(link);
          }, index * 80);
        });
        
        // 右列从顶行(CULTURE)往下出现
        rightLinks.forEach((link, index) => {
          setTimeout(() => {
            scrambleIn(link);
          }, index * 80);
        });
        
        // 收起右上角 menu
        navMenuSlider.classList.remove("is-open");
      }
    });
  }
  
  // 乱码消失效果 - 从右往左消失，整行同时
  function scrambleOut(node, onComplete) {
    const finalText = node.getAttribute('data-text') || node.textContent || "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let frame = 0;
    const totalFrames = finalText.length;
    
    window.clearInterval(node._scrambleTimer);
    
    node._scrambleTimer = window.setInterval(() => {
      const output = finalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          // 从右往左：后面的字符先变成乱码然后消失
          const reverseIndex = finalText.length - 1 - index;
          if (reverseIndex < frame) return "";
          if (reverseIndex < frame + 2) return chars[Math.floor(Math.random() * chars.length)];
          return char;
        })
        .join("");
      
      node.textContent = output;
      frame += 1;
      
      if (frame > totalFrames + 2) {
        window.clearInterval(node._scrambleTimer);
        node.textContent = ""; // 最终消失
        if (onComplete) onComplete();
      }
    }, 25);
  }
  
  // 乱码出现效果 - 从左往右出现，整行同时
  function scrambleIn(node, onComplete) {
    // 优先使用 data-text 属性，否则使用当前文本内容
    const finalText = node.getAttribute('data-text') || node.textContent || "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let frame = 0;

    window.clearInterval(node._scrambleTimer);

    node._scrambleTimer = window.setInterval(() => {
      const output = finalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          // 从左往右：前面的字符先出现
          if (index > frame) return "";
          if (index > frame - 2) return chars[Math.floor(Math.random() * chars.length)];
          return finalText[index];
        })
        .join("");

      node.textContent = output;
      frame += 1;

      if (frame > finalText.length + 2) {
        window.clearInterval(node._scrambleTimer);
        node.textContent = finalText;
        if (onComplete) onComplete();
      }
    }, 25);
  }

  // ===== 第二页逐行向上滑入渐显动画 =====
  const page2 = document.getElementById('page-2');
  if (page2) {
    const bigTextLines = page2.querySelectorAll('.intro-text .text-line');
    const smallTextLinesLeft = page2.querySelectorAll('.intro-note-left .text-line');
    const smallTextLinesRight = page2.querySelectorAll('.intro-note-right .text-line');
    
    let animationTriggered = false;
    
    // 计算延迟时间
    const lineDelay = 150; // 0.15s = 150ms
    const transitionGap = 200; // 0.2s = 200ms
    
    // 大字总行数
    const bigTextLineCount = bigTextLines.length;
    // 大字总动画时间 = (行数 - 1) * 延迟
    const bigTextTotalDelay = (bigTextLineCount - 1) * lineDelay;
    // 小字开始时间 = 大字总延迟 + 过渡间隔
    const smallTextStartTime = bigTextTotalDelay + transitionGap;
    
    // Intersection Observer 监听第二页进入视口
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.33 // 1/3 位置触发
    };
    
    const page2Observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animationTriggered) {
          animationTriggered = true;
          
          // 触发大字动画
          bigTextLines.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add('is-visible');
            }, index * lineDelay);
          });
          
          // 触发左侧小字动画（逐行出现）
          smallTextLinesLeft.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add('is-visible');
            }, smallTextStartTime + index * lineDelay);
          });
          
          // 触发右侧小字动画（逐行出现）
          smallTextLinesRight.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add('is-visible');
            }, smallTextStartTime + index * lineDelay);
          });
        }
      });
    }, observerOptions);
    
    page2Observer.observe(page2);
  }

  // ===== 第四页逐行向上滑入渐显动画 =====
  const page4 = document.querySelector('.process-section');
  if (page4) {
    const processTitleLines = page4.querySelectorAll('.process-title span');
    const processNote = page4.querySelector('.process-note');
    
    let page4AnimationTriggered = false;
    
    // 计算延迟时间
    const page4LineDelay = 150; // 0.15s = 150ms
    const page4TransitionGap = 200; // 0.2s = 200ms
    
    // 大字总行数
    const page4TitleLineCount = processTitleLines.length;
    // 大字总动画时间 = (行数 - 1) * 延迟
    const page4TitleTotalDelay = (page4TitleLineCount - 1) * page4LineDelay;
    // 小字开始时间 = 大字总延迟 + 过渡间隔
    const page4NoteStartTime = page4TitleTotalDelay + page4TransitionGap;
    
    // Intersection Observer 监听第四页进入视口
    const page4ObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.33 // 1/3 位置触发
    };
    
    const page4Observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !page4AnimationTriggered) {
          page4AnimationTriggered = true;
          
          // 触发大字动画（逐行出现）
          processTitleLines.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add('is-visible');
            }, index * page4LineDelay);
          });
          
          // 触发小字动画
          if (processNote) {
            setTimeout(() => {
              processNote.classList.add('is-visible');
            }, page4NoteStartTime);
          }
        }
      });
    }, page4ObserverOptions);
    
    page4Observer.observe(page4);
  }

  // ===== 3个米色长方形滚动绑定动画（scrub效果） =====
  const rectangles = document.querySelectorAll('.rectangle');
  const page3 = document.querySelector('.services-section');
  
  if (rectangles.length > 0 && page3) {
    let isInViewport = false;
    let lastScrollY = window.scrollY;
    let isScrollingUp = false;
    
    // 滚动监听 - 实时绑定
    function handleScroll() {
      const page3Rect = page3.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 判断滚动方向
      const currentScrollY = window.scrollY;
      isScrollingUp = currentScrollY < lastScrollY;
      lastScrollY = currentScrollY;
      
      // 计算第三页进入视口的进度（0 ~ 1）
        // 当第三页顶部进入视口底部时开始，到第三页遮挡第二页1/2时所有方块才完整滑出
        const page3Top = page3Rect.top;
        
        // 当第三页顶部到达视口中间位置时（遮挡第二页1/2），所有方块完整滑出
        // 调整滚动范围，使动画在遮挡1/2时才完成
        const scrollRange = windowHeight * 0.5;
        // 使用缓动函数使动画在接近1/2时加速完成
        let rawProgress = Math.max(0, Math.min(1, (windowHeight - page3Top) / scrollRange));
        // 应用缓动：前50%进度较慢，后50%加速
        const scrollProgress = rawProgress < 0.5 ? rawProgress * 0.6 : 0.3 + (rawProgress - 0.5) * 1.4;
      
      // 检查是否在动画范围内
      const shouldAnimate = page3Top < windowHeight && page3Rect.bottom > 0;
      
      if (shouldAnimate) {
        if (!isInViewport) {
          isInViewport = true;
        }
        
        // 添加 scrub 类，移除过渡效果，实时跟随滚动
        rectangles.forEach((rect) => {
          rect.classList.remove('bounce-out');
          rect.classList.add('scrub');
        });
        
        // 从下往上依次滑入（长方形3 -> 2 -> 1）
        // 所有方块使用相同的动画速度，但有延迟触发
        rectangles.forEach((rect, index) => {
          // 反转索引，使长方形3（index=2）最先出现，长方形1（index=0）最后出现
          const reversedIndex = rectangles.length - 1 - index;
          // 延迟触发：每个方块延迟0.1的进度开始动画
          const delay = reversedIndex * 0.1;
          // 所有方块使用相同的动画持续时间0.3
          const individualProgress = Math.max(0, Math.min(1, (scrollProgress - delay) / 0.3));
          
          // 计算位移：从 -100% 到 0
          const translateX = -100 + (individualProgress * 100);
          rect.style.transform = `translateX(${translateX}%)`;
          rect.style.opacity = individualProgress > 0 ? 1 : 0;
        });
      } else {
        // 离开视口范围
        if (isInViewport) {
          isInViewport = false;
          
          // 向上滚动滑出时添加弹性效果
          if (isScrollingUp) {
            rectangles.forEach((rect) => {
              rect.classList.remove('scrub');
              rect.classList.add('bounce-out');
              rect.style.transform = 'translateX(-100%)';
              rect.style.opacity = '0';
            });
          }
        }
      }
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初始检查
    handleScroll();
  }

  // ===== 第四页卡片滚动绑定动画（scrub效果） =====
  const processCards = document.querySelectorAll('.process-card');
  const page4Section = document.querySelector('.process-section');

  if (processCards.length > 0 && page4Section) {
    let page4IsInViewport = false;

    // 缓动函数：ease-out-cubic
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    // 滚动监听 - 实时绑定
    function handlePage4Scroll() {
      const page4Rect = page4Section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 检查是否在动画范围内
      const shouldAnimate = page4Rect.top < windowHeight && page4Rect.bottom > 0;

      if (shouldAnimate) {
        if (!page4IsInViewport) {
          page4IsInViewport = true;
        }

        // 添加 scrub 类
        processCards.forEach((card) => {
          card.classList.add('scrub');
        });

        // 四张卡片的初始旋转角度
        const initialRotations = [-12.5, 12.2, -22, 11.8];
        
        // 计算滚动进度：
        // 当第四页顶部进入视口时开始（0）
        // 当第四页底部到达视口正中间时才完成（1）
        // 页面高度 140vh，所以滚动范围更大
        const scrollRange = page4Rect.height + windowHeight * 0.5;
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - page4Rect.top) / scrollRange));
        
        // 卡片触发点（基于总滚动进度）
        // 第1张：0% 时开始
        // 第2张：10% 时开始
        // 第3张：20% 时开始
        // 第4张：30% 时开始
        const triggerPoints = [0, 0.1, 0.2, 0.3];
        // 动画持续时间延长20%，让滑动更慢
        const animationDuration = 0.84;

        processCards.forEach((card, index) => {
          const triggerPoint = triggerPoints[index];
          // 计算当前卡片的动画进度（0 ~ 1）
          let rawProgress = (scrollProgress - triggerPoint) / animationDuration;
          // 应用缓动
          let progress = Math.max(0, Math.min(1, easeOutCubic(Math.max(0, rawProgress))));

          // 计算位移：从右下方到最终位置
          const translateX = 400 * (1 - progress);
          const translateY = 300 * (1 - progress);

          // 计算旋转：从初始角度到0
          const rotation = initialRotations[index] * (1 - progress);

          card.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
        });
      } else {
        if (page4IsInViewport) {
          page4IsInViewport = false;
        }
      }
    }

    // 监听滚动事件
    window.addEventListener('scroll', handlePage4Scroll, { passive: true });
    // 初始检查
    handlePage4Scroll();
  }

  // ===== 第五页标题逐行向上滑入渐显动画 =====
  const page5 = document.querySelector('.projects-section');
  if (page5) {
    const projectTitleLines = page5.querySelectorAll('.projects-heading h2 span');
    const projectTiles = page5.querySelectorAll('.project-tile');
    
    let page5AnimationTriggered = false;
    const lineDelay = 150; // 0.15s = 150ms
    
    // Intersection Observer 监听第五页进入视口
    const page5ObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.33 // 1/3 位置触发
    };
    
    const page5Observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !page5AnimationTriggered) {
          page5AnimationTriggered = true;
          
          // 触发大标题动画（逐行出现）
          projectTitleLines.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add('is-visible');
            }, index * lineDelay);
          });
          
          // 触发项目卡片动画
          projectTiles.forEach((tile, tileIndex) => {
            const metaSpans = tile.querySelectorAll('.project-meta span');
            const titleSpans = tile.querySelectorAll('h3 span');
            const tileStartDelay = 300 + tileIndex * 200; // 大标题动画完成后开始
            
            // 小字乱码动效
            metaSpans.forEach((span, spanIndex) => {
              setTimeout(() => {
                scrambleIn(span);
              }, tileStartDelay + spanIndex * 100);
            });
            
            // 小标题滑入动画
            titleSpans.forEach((span, spanIndex) => {
              setTimeout(() => {
                span.classList.add('is-visible');
              }, tileStartDelay + metaSpans.length * 100 + spanIndex * lineDelay);
            });
          });
        }
      });
    }, page5ObserverOptions);
    
    page5Observer.observe(page5);
  }

  // ===== 第三页图片鼠标轨迹效果 =====
  const servicesImageWrapper = document.querySelector('.services-image-wrapper');
  const servicesCanvas = document.querySelector('.services-image-canvas');
  
  if (servicesImageWrapper && servicesCanvas) {
    const ctx = servicesCanvas.getContext('2d');
    let width, height;
    
    // 设置canvas尺寸
    function resizeServicesCanvas() {
      const rect = servicesImageWrapper.getBoundingClientRect();
      width = servicesCanvas.width = rect.width;
      height = servicesCanvas.height = rect.height;
    }
    
    resizeServicesCanvas();
    window.addEventListener('resize', resizeServicesCanvas);
    
    // 轨迹点数组
    const trail = [];
    const maxTrailLength = 30;
    const fadeSpeed = 0.03;
    
    // 鼠标位置
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMouseOver = false;
    
    // 监听鼠标进入/离开
    servicesImageWrapper.addEventListener('mouseenter', () => {
      isMouseOver = true;
    });
    
    servicesImageWrapper.addEventListener('mouseleave', () => {
      isMouseOver = false;
    });
    
    // 监听鼠标移动（相对于图片容器）
    servicesImageWrapper.addEventListener('mousemove', (e) => {
      const rect = servicesImageWrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 计算移动距离
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 3) {
        // 在移动路径上插值添加轨迹点
        const steps = Math.floor(distance / 3);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          trail.push({
            x: lastMouseX + dx * t,
            y: lastMouseY + dy * t,
            size: 40 + Math.random() * 30,
            opacity: 1,
            age: 0
          });
        }
        
        // 限制轨迹点数量
        if (trail.length > maxTrailLength) {
          trail.splice(0, trail.length - maxTrailLength);
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    });
    
    // 初始化鼠标位置
    servicesImageWrapper.addEventListener('mouseenter', (e) => {
      const rect = servicesImageWrapper.getBoundingClientRect();
      lastMouseX = e.clientX - rect.left;
      lastMouseY = e.clientY - rect.top;
    });
    
    // 动画循环
    function animateServicesCanvas() {
      // 清除画布
      ctx.clearRect(0, 0, width, height);
      
      if (trail.length > 0) {
        // 设置混合模式为 lighter 实现叠加发光
        ctx.globalCompositeOperation = 'lighter';
        
        // 绘制每个轨迹点
        for (let i = trail.length - 1; i >= 0; i--) {
          const point = trail[i];
          
          // 更新透明度和年龄
          point.opacity -= fadeSpeed;
          point.age += fadeSpeed;
          
          // 移除完全透明的点
          if (point.opacity <= 0) {
            trail.splice(i, 1);
            continue;
          }
          
          // 创建径向渐变
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, point.size
          );
          
          // 渐变配色：#1425B1 主题色
          gradient.addColorStop(0, `rgba(20, 37, 177, ${point.opacity * 0.8})`);
          gradient.addColorStop(0.7, `rgba(20, 37, 177, ${point.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(20, 37, 177, 0)`);
          
          // 绘制光晕
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        // 重置混合模式
        ctx.globalCompositeOperation = 'source-over';
      }
      
      requestAnimationFrame(animateServicesCanvas);
    }
    
    animateServicesCanvas();
  }

  // ===== 第五页项目图片鼠标轨迹效果 =====
  const projectImageWrappers = document.querySelectorAll('.project-image-wrapper');
  
  projectImageWrappers.forEach((wrapper) => {
    const canvas = wrapper.querySelector('.project-image-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // 设置canvas尺寸
    function resizeCanvas() {
      const rect = wrapper.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 轨迹点数组
    const trail = [];
    const maxTrailLength = 30;
    const fadeSpeed = 0.03;
    
    // 鼠标位置
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMouseOver = false;
    
    // 监听鼠标进入/离开
    wrapper.addEventListener('mouseenter', () => {
      isMouseOver = true;
    });
    
    wrapper.addEventListener('mouseleave', () => {
      isMouseOver = false;
    });
    
    // 监听鼠标移动（相对于图片容器）
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 计算移动距离
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 3) {
        // 在移动路径上插值添加轨迹点
        const steps = Math.floor(distance / 3);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          trail.push({
            x: lastMouseX + dx * t,
            y: lastMouseY + dy * t,
            size: 40 + Math.random() * 30,
            opacity: 1,
            age: 0
          });
        }
        
        // 限制轨迹点数量
        if (trail.length > maxTrailLength) {
          trail.splice(0, trail.length - maxTrailLength);
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    });
    
    // 初始化鼠标位置
    wrapper.addEventListener('mouseenter', (e) => {
      const rect = wrapper.getBoundingClientRect();
      lastMouseX = e.clientX - rect.left;
      lastMouseY = e.clientY - rect.top;
    });
    
    // 动画循环
    function animateCanvas() {
      // 清除画布
      ctx.clearRect(0, 0, width, height);
      
      if (trail.length > 0) {
        // 设置混合模式为 lighter 实现叠加发光
        ctx.globalCompositeOperation = 'lighter';
        
        // 绘制每个轨迹点
        for (let i = trail.length - 1; i >= 0; i--) {
          const point = trail[i];
          
          // 更新透明度和年龄
          point.opacity -= fadeSpeed;
          point.age += fadeSpeed;
          
          // 移除完全透明的点
          if (point.opacity <= 0) {
            trail.splice(i, 1);
            continue;
          }
          
          // 创建径向渐变
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, point.size
          );
          
          // 渐变配色：#1425B1 主题色
          gradient.addColorStop(0, `rgba(20, 37, 177, ${point.opacity * 0.8})`);
          gradient.addColorStop(0.7, `rgba(20, 37, 177, ${point.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(20, 37, 177, 0)`);
          
          // 绘制光晕
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        // 重置混合模式
        ctx.globalCompositeOperation = 'source-over';
      }
      
      requestAnimationFrame(animateCanvas);
    }
    
    animateCanvas();
  });

  // ===== 第五页项目卡片视差滚动效果 =====
  const projectsSection = document.querySelector('.projects-section');
  const tileLeft = document.querySelector('.tile-left');
  const tileCenter = document.querySelector('.tile-center');
  const tileRight = document.querySelector('.tile-right');
  
  if (projectsSection && tileLeft && tileCenter && tileRight) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateParallax() {
      const rect = projectsSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // 计算滚动进度（-1 到 1）
      // 当section在视口中间时为0，向上滚动为负，向下滚动为正
      const scrollProgress = (windowHeight / 2 - sectionTop) / (sectionHeight + windowHeight) * 2 - 1;
      
      // 限制范围在 -1 到 1
      const clampedProgress = Math.max(-1, Math.min(1, scrollProgress));
      
      // 移动距离（10%）
      const moveDistance = 0.1;
      
      // 图一和图三往上移动，图二往下移动
      // 往上滚动（clampedProgress < 0）：图一图三上移，图二下移
      // 往下滚动（clampedProgress > 0）：图一图三下移，图二上移
      const offset = clampedProgress * moveDistance * 100; // 转换为百分比
      
      tileLeft.style.transform = `translateY(${-offset}%)`;
      tileRight.style.transform = `translateY(${-offset}%)`;
      tileCenter.style.transform = `translateY(${offset}%)`;
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    
    // 初始调用
    updateParallax();
  }

  // ===== 第六页轮播效果 =====
  const testimonialSection = document.querySelector('.testimonial-section');
  if (testimonialSection) {
    const slides = testimonialSection.querySelectorAll('.testimonial-slide');
    const prevBtn = testimonialSection.querySelector('.testimonial-arrow-prev');
    const nextBtn = testimonialSection.querySelector('.testimonial-arrow-next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // 初始化显示第一张
    function showSlide(index) {
      // 确保索引在范围内（循环）
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      
      // 隐藏所有幻灯片
      slides.forEach((slide) => {
        slide.classList.remove('is-active');
        // 重置动画状态
        const brandSpan = slide.querySelector('.testimonial-brand span');
        const quoteSpans = slide.querySelectorAll('.testimonial-quote span');
        if (brandSpan) brandSpan.classList.remove('is-visible');
        quoteSpans.forEach((span) => span.classList.remove('is-visible'));
      });
      
      // 显示当前幻灯片
      const currentSlide = slides[currentIndex];
      currentSlide.classList.add('is-active');
      
      // 触发动画
      const lineDelay = 150;
      const brandSpan = currentSlide.querySelector('.testimonial-brand span');
      const quoteSpans = currentSlide.querySelectorAll('.testimonial-quote span');
      const counterSpan = currentSlide.querySelector('.testimonial-counter');
      const authorSpan = currentSlide.querySelector('.testimonial-author');
      
      // 标题滑入动画
      setTimeout(() => {
        if (brandSpan) brandSpan.classList.add('is-visible');
      }, 100);
      
      // 引用文字逐行滑入动画
      quoteSpans.forEach((span, index) => {
        setTimeout(() => {
          span.classList.add('is-visible');
        }, 100 + lineDelay * (index + 1));
      });
      
      // 小字乱码动效
      const quoteLineCount = quoteSpans.length;
      setTimeout(() => {
        if (counterSpan) scrambleIn(counterSpan);
      }, 100 + lineDelay * (quoteLineCount + 1));
      
      setTimeout(() => {
        if (authorSpan) scrambleIn(authorSpan);
      }, 100 + lineDelay * (quoteLineCount + 1) + 100);
    }
    
    // 上一张
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
      });
    }
    
    // 下一张
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
      });
    }
    
    // Intersection Observer 监听第六页进入视口时播放动画
    const testimonialObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.33
    };
    
    let hasAnimated = false;
    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          showSlide(0);
        }
      });
    }, testimonialObserverOptions);
    
    testimonialObserver.observe(testimonialSection);
  }

  // ===== 第七页新闻卡片蓝色背景平移效果 + 图片切换 =====
  const newsCards = document.querySelectorAll('.news-card');
  const newsHoverBg = document.querySelector('.news-hover-bg');
  const newsLayout = document.querySelector('.news-layout');
  const newsImages = document.querySelectorAll('.news-feature-img');

  if (newsHoverBg && newsCards.length > 0 && newsLayout) {
    // 卡片位置映射 (相对于第一个卡片的位置偏移)
    const cardPositions = [
      { x: 0, y: 0 },      // 第一个卡片
      { x: 100, y: 0 },    // 第二个卡片
      { x: 0, y: 100 },    // 第三个卡片
      { x: 100, y: 100 }   // 第四个卡片
    ];

    // 切换图片函数
    function switchImage(index) {
      newsImages.forEach((img, i) => {
        if (i === index) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    }

    // 更新卡片文字颜色
    function updateCardTextColor(activeIndex) {
      newsCards.forEach((card, i) => {
        if (i === activeIndex) {
          card.style.color = '#E8E6DF'; // 米色
        } else {
          card.style.color = '#1425B1'; // 蓝色
        }
      });
    }

    // 初始化第一个卡片为米色
    updateCardTextColor(0);

    // 为每个卡片添加悬浮事件
    newsCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        const pos = cardPositions[index];
        if (pos) {
          newsHoverBg.style.transform = `translate(${pos.x}%, ${pos.y}%)`;
        }

        // 切换对应的图片
        const imgIndex = parseInt(card.dataset.index) || 0;
        switchImage(imgIndex);

        // 更新文字颜色
        updateCardTextColor(index);
      });
    });

    // 鼠标离开整个区域时，回到第一个卡片位置和图片
    newsLayout.addEventListener('mouseleave', () => {
      newsHoverBg.style.transform = 'translate(0%, 0%)';
      switchImage(0);
      updateCardTextColor(0);
    });
  }

  // ===== 第七页左侧图片鼠标轨迹效果 =====
  const newsFeature = document.querySelector('.news-feature');
  const newsCanvas = document.querySelector('.news-feature-canvas');

  if (newsFeature && newsCanvas) {
    const ctx = newsCanvas.getContext('2d');
    let width, height;

    // 设置canvas尺寸
    function resizeNewsCanvas() {
      const rect = newsFeature.getBoundingClientRect();
      width = newsCanvas.width = rect.width;
      height = newsCanvas.height = rect.height;
    }

    resizeNewsCanvas();
    window.addEventListener('resize', resizeNewsCanvas);

    // 轨迹点数组
    const trail = [];
    const maxTrailLength = 30;
    const fadeSpeed = 0.03;

    // 鼠标位置
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMouseOver = false;

    // 监听鼠标进入/离开
    newsFeature.addEventListener('mouseenter', () => {
      isMouseOver = true;
    });

    newsFeature.addEventListener('mouseleave', () => {
      isMouseOver = false;
    });

    // 监听鼠标移动（相对于图片容器）
    newsFeature.addEventListener('mousemove', (e) => {
      const rect = newsFeature.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 计算移动距离
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 3) {
        // 在移动路径上插值添加轨迹点
        const steps = Math.floor(distance / 3);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          trail.push({
            x: lastMouseX + dx * t,
            y: lastMouseY + dy * t,
            size: 40 + Math.random() * 30,
            opacity: 1,
            age: 0
          });
        }

        // 限制轨迹点数量
        if (trail.length > maxTrailLength) {
          trail.splice(0, trail.length - maxTrailLength);
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    });

    // 初始化鼠标位置
    newsFeature.addEventListener('mouseenter', (e) => {
      const rect = newsFeature.getBoundingClientRect();
      lastMouseX = e.clientX - rect.left;
      lastMouseY = e.clientY - rect.top;
    });

    // 动画循环
    function animateNewsCanvas() {
      // 清除画布
      ctx.clearRect(0, 0, width, height);

      if (trail.length > 0) {
        // 设置混合模式为 lighter 实现叠加发光
        ctx.globalCompositeOperation = 'lighter';

        // 绘制每个轨迹点
        for (let i = trail.length - 1; i >= 0; i--) {
          const point = trail[i];

          // 更新透明度和年龄
          point.opacity -= fadeSpeed;
          point.age += fadeSpeed;

          // 移除完全透明的点
          if (point.opacity <= 0) {
            trail.splice(i, 1);
            continue;
          }

          // 创建径向渐变
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, point.size
          );

          // 渐变配色：#1425B1 主题色
          gradient.addColorStop(0, `rgba(20, 37, 177, ${point.opacity * 0.8})`);
          gradient.addColorStop(0.7, `rgba(20, 37, 177, ${point.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(20, 37, 177, 0)`);

          // 绘制光晕
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // 重置混合模式
        ctx.globalCompositeOperation = 'source-over';
      }

      requestAnimationFrame(animateNewsCanvas);
    }

    animateNewsCanvas();
  }

  // ===== 最后一页 Footer 乱码动效 =====
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const scrambleTexts = footer.querySelectorAll('.scramble-text');
    let footerAnimated = false;

    const footerObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !footerAnimated) {
          footerAnimated = true;

          // 所有文字依次执行乱码动效
          scrambleTexts.forEach((text, index) => {
            // 初始隐藏
            text.style.opacity = '0';

            setTimeout(() => {
              text.style.opacity = '1';
              scrambleIn(text);
            }, index * 50); // 每个元素间隔50ms
          });
        }
      });
    }, footerObserverOptions);

    footerObserver.observe(footer);
  }
});
