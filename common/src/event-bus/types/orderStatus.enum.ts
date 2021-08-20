export enum OrderStatus {
  /**
   * When the order has been created, but the
   * ticket it is trying to order has not been reserved
   */
  CREATED = 'created',

  /**
   * The ticket the order is trying to reserve has already
   * been reserved, or hwen the user has cancelled the order.
   * The order expires before payment
   */
  CANCELLED = 'cancelled',

  /**
   * The order has successfully reserved the ticket
   */
  AWAITING_PAYMENT = 'awaiting:payment',

  /**
   * The roder has reserved the ticket and the user has
   * provided payment successfully
   */
  COMPLETED = 'compeleted',
}
