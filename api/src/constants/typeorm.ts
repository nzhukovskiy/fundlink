// src/constants/typeorm.ts
import { Startup } from "../features/users/startups/entities/startup.entity";
import { Investor } from "../features/users/investors/entities/investor";
import { FundingRound } from "../features/investments/entities/funding-round/funding-round";
import { Investment } from "../features/investments/entities/investment/investment";
import { Tag } from "../features/tags/entities/tag/tag";
import { Chat } from "../features/chats/entities/chat/chat";
import { Message } from "../features/chats/entities/message/message";
import { Notification } from "../features/notifications/entities/notification/notification"
import {
    FundingRoundChangeProposal
} from "../features/investments/entities/funding-round-change-proposal/funding-round-change-proposal";
import { InvestorVote } from "../features/investments/entities/investor-vote/investor-vote";
import { Exit } from "../features/users/startups/entities/exit";
import { RefreshToken } from "../features/token/entities/refresh-token";

export const entities = [Startup, Investor, FundingRound, Investment, Tag, Chat, Message, Notification, FundingRoundChangeProposal, InvestorVote, Exit, RefreshToken];
export const migrations = ['src/migrations/*.ts'];