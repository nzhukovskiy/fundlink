// src/constants/typeorm.ts
import { Startup } from "../features/users/startups/entities/startup";
import { Investor } from "../features/users/investors/entities/investor";
import { FundingRound } from "../features/investments/entities/funding-round/funding-round";
import { Investment } from "../features/investments/entities/investment/investment";
import { Tag } from "../features/tags/entities/tag/tag";
import { Chat } from "../features/chats/entities/chat/chat";
import { Message } from "../features/chats/entities/message/message";

export const entities = [Startup, Investor, FundingRound, Investment, Tag, Chat, Message];
export const migrations = ['src/migrations/*.ts'];