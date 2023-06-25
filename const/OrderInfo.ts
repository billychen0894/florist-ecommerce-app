export interface HoverCardInfo {
  screenReaderText: string;
  hoverCardText: string;
}

export const shippingHoverCardInfo: HoverCardInfo = {
  screenReaderText: 'More Shipping estimate info',
  hoverCardText:
    'Shipping estimates are based on the shipping method you choose. Some items may arrive sooner than the estimates shown. You can see the actual arrival date in checkout.',
};

export const taxHoverCardInfo: HoverCardInfo = {
  screenReaderText: 'More Tax estimate info',
  hoverCardText:
    'The actual tax amount is calculated based on your shipping address.',
};
