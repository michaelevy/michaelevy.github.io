
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  function handleResize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  const START_POSITION = [canvas.width / 3, canvas.height / 2];
  const END_POSITION = [canvas.width / 2, canvas.height / 2];
  let pointerPosition = [...START_POSITION];
  let targetPointerPosition = [...pointerPosition];

  let stage = 0;
  let cumulativeOffset = {
    angle: 0,
    distance: 0,
    hue: 100,
  };
  let baseOffset = {
    angle: 0,
    distance: 0,
  };

  let modificationOffset = {
    angle: 0,
    distance: 0,
  };

  let cumulativePosition = [...START_POSITION];

  const DISTANCE_SCALING = 1;
  const ANGLE_SCALING = 1;
  const MAX_STAGE = Infinity;
  const POINTER_CHASE = 0.1;

  function tick() {
    const targetPointerDisplacement = [
      targetPointerPosition[0] - pointerPosition[0],
      targetPointerPosition[1] - pointerPosition[1],
    ];

    const scaledTargetPointerDisplacement = [
      targetPointerDisplacement[0] * POINTER_CHASE,
      targetPointerDisplacement[1] * POINTER_CHASE,
    ];

    pointerPosition = [
      pointerPosition[0] + scaledTargetPointerDisplacement[0],
      pointerPosition[1] + scaledTargetPointerDisplacement[1],
    ];

    // ha
    stage = 0;

    if (stage === 0) {
      cumulativeOffset.angle = 0;
      cumulativeOffset.distance = 0;
      cumulativeOffset.hue = 100;
      cumulativePosition = [...START_POSITION];
      context.fillStyle = "rgb(31, 39, 54)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = getColour(cumulativeOffset.hue);
      fillCircle(...START_POSITION, 5 * devicePixelRatio);
      fillCircle(...END_POSITION, 5 * devicePixelRatio);
      fillCircle(...pointerPosition, 5 * devicePixelRatio);

      context.beginPath();
      context.moveTo(...START_POSITION);
      context.lineTo(...END_POSITION);
      context.lineTo(...pointerPosition);
      context.strokeStyle = getColour(cumulativeOffset.hue);
      context.lineWidth = 2 * devicePixelRatio;
      context.stroke();
      context.closePath();

      const baseDifference = [
        END_POSITION[0] - START_POSITION[0],
        END_POSITION[1] - START_POSITION[1],
      ];
      const baseDistance = Math.hypot(...baseDifference);
      const baseAngle = Math.atan2(baseDifference[1], baseDifference[0]);

      baseOffset.angle = baseAngle;
      baseOffset.distance = baseDistance;

      const pointerDifference = [
        pointerPosition[0] - END_POSITION[0],
        pointerPosition[1] - END_POSITION[1],
      ];

      const pointerAngle = Math.atan2(
        pointerDifference[1],
        pointerDifference[0]
      );
      const pointerDistance = Math.hypot(...pointerDifference);

      modificationOffset.angle = pointerAngle - baseAngle;
      modificationOffset.distance = pointerDistance / baseDistance;

      // console.log(pointerAngle, baseAngle);

      cumulativeOffset.angle = pointerAngle;
      cumulativeOffset.distance = pointerDistance;
      cumulativePosition = [...pointerPosition];

      stage++;
    }

    for (let i = 0; i < 1000; i++) {
      if (stage >= MAX_STAGE) {
        break;
      }

      cumulativeOffset.angle += modificationOffset.angle;
      cumulativeOffset.distance *= modificationOffset.distance;
      cumulativeOffset.hue += 1;

      const position = [
        cumulativePosition[0] +
          Math.cos(cumulativeOffset.angle) * cumulativeOffset.distance,
        cumulativePosition[1] +
          Math.sin(cumulativeOffset.angle) * cumulativeOffset.distance,
      ];

      context.beginPath();
      context.moveTo(...cumulativePosition);
      context.lineTo(...position);
      context.strokeStyle = getColour(cumulativeOffset.hue);
      context.lineWidth = 2 * devicePixelRatio;
      context.stroke();
      context.closePath();

      cumulativePosition = position;
      stage++;
    }

    requestAnimationFrame(tick);
  }

  function getColour(hue) {
    return `hsl(${hue}deg, 100%, 70%)`;
  }

  function fillCircle(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }

  function updatePointerPosition(event) {
    targetPointerPosition = [
      event.clientX * devicePixelRatio,
      event.clientY * devicePixelRatio,
    ];
  }

  let isPointerDown = false;

  let touchMode = false;

  addEventListener("touchstart", (e) => {
    touchMode = true;
  });

  addEventListener("pointermove", (e) => {
    if (isPointerDown) {
      END_POSITION[0] = e.clientX * devicePixelRatio;
      END_POSITION[1] = e.clientY * devicePixelRatio;
    }

    if (touchMode) {
      return;
    }
    updatePointerPosition(e);
  });
  addEventListener("pointerdown", (e) => {
    START_POSITION[0] = e.clientX * devicePixelRatio;
    START_POSITION[1] = e.clientY * devicePixelRatio;
    END_POSITION[0] = e.clientX * devicePixelRatio;
    END_POSITION[1] = e.clientY * devicePixelRatio;
    isPointerDown = true;
    if (touchMode) {
      return;
    }
    updatePointerPosition(e);
  });
  addEventListener("pointerup", (e) => {
    END_POSITION[0] = e.clientX * devicePixelRatio;
    END_POSITION[1] = e.clientY * devicePixelRatio;
    isPointerDown = false;
    if (touchMode) {
      return;
    }
    updatePointerPosition(e);
  });

  tick();
