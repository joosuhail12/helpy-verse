
import React from 'react';
import { MessageTransformPlugin, ChatPluginContext } from '../types';
import { ChatMessage } from '../../components/conversation/types';

/**
 * A demo plugin that analyzes sentiment in messages
 * and adds emoji indicators based on the sentiment
 */
export const SentimentAnalysisPlugin: MessageTransformPlugin = {
  type: 'messageTransform',
  id: 'sentiment-analysis',
  name: 'Sentiment Analysis',
  description: 'Analyzes message sentiment and adds emoji indicators',
  
  transformMessage: (message: ChatMessage, context: ChatPluginContext) => {
    // Skip analysis for system messages
    if (message.sender === 'system') {
      return message;
    }
    
    const content = message.content || '';
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['happy', 'great', 'excellent', 'good', 'thanks', 'love', 'appreciate'];
    const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'angry', 'hate', 'disappointed'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    // Count positive and negative words
    const words = content.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });
    
    // Calculate sentiment
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveScore > negativeScore) sentiment = 'positive';
    else if (negativeScore > positiveScore) sentiment = 'negative';
    
    // Create a message with sentiment information
    const transformedMessage: ChatMessage = {
      ...message,
      metadata: {
        ...message.metadata,
        sentiment,
        positiveScore,
        negativeScore
      }
    };
    
    return transformedMessage;
  }
};
