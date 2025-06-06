import { NotificationTimings } from "./notification-timings";

export const FundingRoundNotificationsTimings = {
    [NotificationTimings.SEVEN_DAY]: 7 * 24 * 60 * 60 * 1000,
    [NotificationTimings.THREE_DAY]: 3 * 24 * 60 * 60 * 1000,
    [NotificationTimings.ONE_DAY]: 24 * 60 * 60 * 1000,
}