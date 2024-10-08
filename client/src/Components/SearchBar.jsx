/* eslint-disable no-unused-vars */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { setMessage, addToHistory } from '../constants/MessageAndHistoryContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const MessageInput = () => {
  const message = useSelector((state) => state.chat.message);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() === '') {
      toast.error('Please enter a message');
      return;
    }

    dispatch(addToHistory(message));
    dispatch(setMessage(''));

    try {
      const response = await axios.post('http://localhost:3000/generate', {
        prompt: message,
      });
      if (response.data.success) {
        dispatch(addToHistory(response.data.data));
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to send message');
    }

    toast.success('Message sent!');
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-12 fixed bottom-0 left-0 w-full bg-gradient-to-r from-black to-gray-700 p-4 shadow-lg"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => dispatch(setMessage(e.target.value))}
            placeholder="Message ChatGPT..."
            className="w-full bg-gray-700 text-white rounded-full py-3 px-6 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Send className="w-6 h-6" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default MessageInput;