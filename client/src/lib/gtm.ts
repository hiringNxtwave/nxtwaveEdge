declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const sendGTMEvent = (eventName: string, eventParams?: object) => {
  if (typeof window !== "undefined") {
    const eventData = {
      event: eventName,
      ...eventParams,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
    if (import.meta.env.DEV) {
      console.log("GTM Event:", eventData);
    }
  }
};
