<template>
  <div class="container mx-auto p-8">
    <router-link to="/" class="flex items-center text-blue-500 hover:underline mb-4">
      <ArrowLeftIcon class="w-5 h-5 mr-2" /> Back
    </router-link>
    <Card>
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
        <CardDescription>Last updated: Feb 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="mb-4">Welcome to Milestones!</p>
        <p class="mb-4">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your
          information when you use Milestones ("we," "our," or "us"). By using our application, you agree to the terms
          outlined in this Privacy Policy.
        </p>

        <Separator class="my-4" />

        <h2 class="text-lg font-semibold mt-4">1. Information We Collect</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li><strong>Personal Information:</strong> Name, email, profile picture, and other details.</li>
          <li><strong>Goal and Progress Data:</strong> Milestones, actions, and tracking information.</li>
          <li><strong>User Content:</strong> Photos, comments, and uploaded content.</li>
          <li><strong>Social Interactions:</strong> Friends list, interactions, and app activity.</li>
          <li><strong>Device and Usage Data:</strong> Device details, IP address, and app usage statistics.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">2. How We Use Your Information</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li>Provide, personalize, and improve Milestones.</li>
          <li>Facilitate social interactions and goal tracking.</li>
          <li>Communicate updates and support.</li>
          <li>Enhance security and compliance.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">3. How We Share Your Information</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li><strong>With Your Friends:</strong> Goal progress visibility.</li>
          <li><strong>With Service Providers:</strong> To improve our platform.</li>
          <li><strong>For Legal Compliance:</strong> If required by law.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">4. Your Privacy Choices</h2>
        <p class="mt-2">You can manage privacy settings, update or delete account info, and request data access or
          deletion.</p>

        <h2 class="text-lg font-semibold mt-4">5. Data Security</h2>
        <p class="mt-2">We use security measures to protect your data, but no system is completely secure.</p>

        <h2 class="text-lg font-semibold mt-4">6. Children’s Privacy</h2>
        <p class="mt-2">Milestones is not intended for children under 13. We delete any detected underage data.</p>

        <h2 class="text-lg font-semibold mt-4">7. Changes to This Policy</h2>
        <p class="mt-2">We may update this Privacy Policy periodically and notify users of significant changes.</p>

        <h2 class="text-lg font-semibold mt-4">8. Contact Us</h2>
        <p class="mt-2">
          For any questions, contact us at
          <a href="mailto:support@milestones.com" class="text-blue-500 hover:underline">support@milestones.com</a>.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon } from "lucide-vue-next";
</script>
