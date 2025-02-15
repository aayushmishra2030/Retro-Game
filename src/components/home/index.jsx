import { useEffect, useState } from 'react'
import List from './List'

export default function Home() {
  const allData = {
    title: 'menu',
    data: [
      {
        type: 'text',
        title: 'biography',
        data: 'Namaste, this is my one of many unprofessional websites that I build for fun and I have been doing this for almost an year now.',
      },
      {
        title: 'projects',
        data: [
          {
            type: 'link',
            title: 'GSH DevCon Submissions',
            data: 'https://github.com/aayushmishra2027/gsh.dev',
          },
          {
            type: 'link',
            title: 'portfolio v1',
            data: 'https://github.com/aayushmishra2027/my-portfolio',
          },
          {
            type: 'link',
            title: 'Cpp-Programs',
            data: 'https://github.com/aayushmishra2027/cpp-programs',
          },
        ],
      },
      {
        title: 'socials',
        data: [
          {
            type: 'link',
            title: 'github',
            data: 'https://github.com/aayushmishra2027',
          },
          {
            type: 'link',
            title: 'linkedin',
            data: 'https://www.linkedin.com/in/aayush-anil-mishra/',
          },
          {
            type: 'link',
            title: 'instagram',
            data: 'https://www.instagram.com/aayush.json',
          },
          {
            type: 'link',
            title: 'email',
            data: 'mailto:aayushmishra1105@gmail.com',
          },
        ],
      },
      {
        type: 'text',
        title: 'skills',
        data: 'Html-css ,React.js ,JavaScript ,Python ,NextJs ,TypeScript ,Tailwind ,React Hooks ,Redux ,Git',
      },
    ],
  }

  const [data, setData] = useState(allData)
  const [userStepNavigation, setUserStepNavigation] = useState([])
  const [focusOption, setFocusOption] = useState(1)
  const totalOptions = data.data.length + 1
  const [isSilent, setIsSilent] = useState(false)

  const getTargetList = (currentKeyPress) => {
    let newFocusOption = focusOption

    if (currentKeyPress === 'up') {
      newFocusOption = Math.max(focusOption - 1, 1) // Prevent going below 1
    } else {
      newFocusOption = Math.min(focusOption + 1, totalOptions) // Prevent going above totalOptions
    }

    setFocusOption(newFocusOption)

    return `menu-option-${newFocusOption}`
  }

  const changeLightColor = (el = 'left-light') => {
    const lightElement = document.getElementById(el)
    lightElement.style.background = 'rgb(255 0 0)'

    setTimeout(() => {
      lightElement.style.background = '#000'
    }, 100)
  }

  const playBtnSound = (id) => {
    if (!isSilent) {
      const audio = new Audio('/assets/audio/btn.m4a')
      audio.muted = !document.interacted // Mute audio until user interaction
      audio
        .play()
        .then(() => {
          audio.muted = false // Unmute once audio starts playing after interaction
        })
        .catch((error) => {
          console.log('Audio play failed:', error)
        })
    }
    changeLightColor(id)
  }

  const getDistanceFromParentTop = (targetList) => {
    const parentElement = document.getElementById('screen')
    const childElement = document.getElementById(targetList)

    if (!childElement) return 0

    const parentRect = parentElement.getBoundingClientRect()
    const childRect = childElement.getBoundingClientRect()

    return childRect.top - parentRect.top
  }

  const moveArrow = (currentKeyPress, reset = false) => {
    let targetList = ''
    if (!reset) {
      targetList = getTargetList(currentKeyPress)
    } else {
      targetList = `menu-option-1`
      setFocusOption(1)
    }

    const scrollerElement = document.getElementById('scroller-screen')
    const childElement = document.getElementById(targetList)
    const arrow = document.getElementById('arrow')

    if (childElement && arrow) {
      const position = getDistanceFromParentTop(targetList)
      arrow.style.transform = `translateY(${position}px)`

      const childRect = childElement.getBoundingClientRect()
      const scrollerRect = scrollerElement.getBoundingClientRect()

      // Check if the arrow is near the bottom of the scroller screen container
      if (childRect.bottom > scrollerRect.bottom) {
        // Scroll down
        scrollerElement.scrollTop += childRect.bottom - scrollerRect.bottom
      }

      // Check if the arrow is near the top of the scroller screen container
      if (childRect.top < scrollerRect.top) {
        // Scroll up
        scrollerElement.scrollTop -= scrollerRect.top - childRect.top
      }
    }
  }

  const scrollOnTextContent = (value) => {
    const scrollerElement = document.getElementById('scroller-screen')
    scrollerElement.scroll({
      top: scrollerElement.scrollTop + value,
      behavior: 'smooth',
    })
  }

  const backSateAction = (id = 'left-light') => {
    playBtnSound(id)
    if (userStepNavigation.length > 0) {
      const scrollerElement = document.getElementById('scroller-screen')
      scrollerElement.scroll({
        top: 0,
      })
      setUserStepNavigation((prev) => prev.slice(0, -1))
      setData(userStepNavigation.at(-1))
      moveArrow('up', true)
    }
  }

  const selectOption = () => {
    if (focusOption === data.data.length + 1) {
      backSateAction()
    } else {
      if (data.data[focusOption - 1].type === 'link') {
        window.open(data.data[focusOption - 1].data, '_blank')
        return
      }
      setUserStepNavigation((prev) => [...prev, data])
      setData(data.data[focusOption - 1])
    }
    moveArrow('up', true)
  }

  const keyUp = () => {
    playBtnSound()
    if (typeof data.data === 'string') {
      scrollOnTextContent(-10)
      return
    }
    moveArrow('up')
  }

  const keyDown = () => {
    playBtnSound()
    if (typeof data.data === 'string') {
      scrollOnTextContent(+10)
      return
    }
    moveArrow('down')
  }

  const keyEnter = (id = 'left-light') => {
    playBtnSound(id)
    if (typeof data.data !== 'string') {
      selectOption()
    } else {
      if (data.type !== 'link') {
        backSateAction()
        moveArrow('up', true)
      } else {
        window.location.href = data.data
      }
    }
  }

  const silentKey = () => {
    setIsSilent(!isSilent)
  }

  useEffect(() => {
    if (!isSilent) {
      playBtnSound()
    } else {
      changeLightColor()
    }
  }, [isSilent])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 38) {
        // Up arrow
        keyUp()
      } else if (event.keyCode === 40) {
        keyDown()
      } else if (event.keyCode === 13) {
        // Enter  presed
        keyEnter()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusOption, data, userStepNavigation])

  return (
    <section className="relative h-[100vh]">
      <div className="relative h-[650px] w-[365px] m-auto top-1/2 -translate-y-1/2">
        <img
          src="/assets/img/console.png"
          className="h-[650px] w-[365px] absolute z-10 bg-no-repeat bg-contain"
        />
        <img
          src="/assets/img/silent-btn.png"
          className="absolute right-5 top-[316px] z-20 rounded-full cursor-pointer btn"
          onClick={silentKey}
        />
        <img
          src="/assets/img/enter.png"
          className="absolute right-[40px] top-[392px] z-20 rounded-full cursor-pointer w-[45px] btn"
          onClick={() => keyEnter('enter-light')}
        />
        <img
          src="/assets/img/enter.png"
          className="absolute right-[98px] top-[420px] z-20 rounded-full cursor-pointer w-[45px] btn"
          id="back-btn"
          onClick={() => backSateAction('back-light')}
        />
        <div
          className="left-[27px] z-20 bottom-[162px] bg-black rounded-full h-[10px] w-[10px] absolute transition-all"
          id="left-light"
        ></div>
        <div
          className="right-[37px] z-20 bottom-[197px] bg-black rounded-full h-[10px] w-[10px] absolute transition-all"
          id="enter-light"
        ></div>
        <div
          className="right-[99px] z-20 bottom-[167px] bg-black rounded-full h-[10px] w-[10px] absolute transition-all"
          id="back-light"
        ></div>
        <div className="dpad">
          <div
            className="dpad-up main-btn cursor-pointer"
            onClick={keyUp}
          ></div>
          <div
            className="dpad-down main-btn cursor-pointer"
            onClick={keyDown}
          ></div>
          <div
            className="dpad-left main-btn cursor-pointer"
            onClick={() => backSateAction()}
          ></div>
          <div
            className="dpad-right main-btn cursor-pointer"
            onClick={() => keyEnter()}
          ></div>
          <div className="dpad-center"></div>
        </div>
        <div
          className="absolute p-1 font-SaboRegular text-xs text-black z-0 bg-[#2b5329] w-[214px] h-[178px] left-1/2 top-[106px] -translate-x-1/2  overflow-hidden overflow-y-scroll scroll-width-none"
          id="scroller-screen"
        >
          <div
            className="flex flex-row  gap-2 justify-center overflow-y-scroll"
            id="screen"
          >
            <div className="relative w-3  flex-shrink-0">
              <img
                className="w-3 absolute transition-all"
                src="/assets/img/greater.svg"
                id="arrow"
              />
            </div>

            <List data={data.data} userStepNavigation={userStepNavigation} />
            <div className="relative w-3 flex-shrink-0"></div>
          </div>
        </div>
        <img
          className="w-3 absolute transition-all right-[82px] top-[110px]"
          src={`/assets/img/${isSilent ? 'silent' : 'unsilent'}.svg`}
          id="arrow"
        />
        <div className="absolute bottom-8 w-full left-1/2 -translate-x-1/2 z-10">
          <p className="text-center text-sm text-black font-extrabold">
            Made With ❤️ By{' '}
            <a
              className="text-[#4d14ff]"
              href="https://github.com/aayushmishra2027/Retro-Game"
              target="_blank"
            >
              Aayush
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
