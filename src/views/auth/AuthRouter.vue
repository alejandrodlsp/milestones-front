<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from 'vue';
const quotes = [
  "The future belongs to those who believe in the beauty of their dreams and take action to make them reality.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The only way to achieve the impossible is to believe it is possible.",
  "Dream big. Start small. Act now.",
  "It’s not about the destination, it’s about the progress you make along the way.",
  "The path to success is always under construction, but every step forward brings you closer.",
  "Your goals are within reach; just keep moving one step at a time.",
  "Don’t wait for the perfect moment. Take the moment and make it perfect.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Every milestone is a step closer to your dreams.",
  "Set goals that scare you and excite you at the same time.",
  "Push yourself, because no one else is going to do it for you.",
  "A goal without a plan is just a wish. Make your plan and take action.",
  "It always seems impossible until it’s done.",
  "The secret of getting ahead is getting started.",
  "The journey of a thousand miles begins with one step.",
  "Believe you can and you’re halfway there.",
  "When you feel like quitting, remember why you started."
];
// Select a random quote on page load
const selectedQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);
</script>

<template>
  <div class="md:hidden">
    <VPImage alt="Authentication" width="1280" height="1214" class="block" :image="{
      dark: '/examples/authentication-dark.png',
      light: '/examples/authentication-light.png',
    }" />
  </div>

  <div
    class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex overflow-hidden">
      <div class="absolute inset-0 bg-black/50 z-10" />
      <div class="absolute inset-0 fade-images z-0" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" class="mr-2 h-6 w-6">
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        Milestones App
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo; {{ selectedQuote }} &rdquo;
          </p>
        </blockquote>
      </div>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.fade-images {
  background-size: cover;
  background-position: center;
  background-image: url('https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg?cs=srgb&dl=pexels-david-bartus-43782-586687.jpg&fm=jpg');
}
</style>
