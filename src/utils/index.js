import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
}

export function validateEmail(email) {
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

export function smoothScrollTo(elToScroll, elToScrollTo, offset) {
  const y1 = elToScroll.scrollTop;
  const y2 = offset ? elToScrollTo.offsetTop + offset : elToScrollTo.offsetTop;
  const distance = Math.abs(y2 - y1);
  const direction = y2 > y1 ? "down" : "up";
  const t1 = performance.now();
  const t2 = 400;
  const easingFn = (t) => t * (2 - t);

  const tick = () => {
    const elapsed = performance.now() - t1;
    const progress = Math.min(elapsed / t2, 1);
    const temp = easingFn(progress) * distance;
    const y = direction === "down" ? y1 + temp : y1 - temp;

    if (progress < 1) {
      elToScroll.scrollTop = y;
      requestAnimationFrame(tick);
    } else {
      elToScroll.scrollTop = y2;
    }
  };

  if (distance === 0) {
    return;
  }

  requestAnimationFrame(tick);
}
