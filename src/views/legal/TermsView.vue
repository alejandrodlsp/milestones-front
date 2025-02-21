<template>
  <div class="container mx-auto p-8">
    <router-link to="/" class="flex items-center text-blue-500 hover:underline mb-4">
      <ArrowLeftIcon class="w-5 h-5 mr-2" /> Back
    </router-link>
    <Card>
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>Last updated: Feb 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="mb-4">Welcome to Milestones!</p>
        <p class="mb-4">
          These Terms of Service ("Terms") govern your use of Milestones ("we," "our," or "us"), a social platform
          designed
          to help users track and achieve their goals. By accessing or using our application, you agree to these Terms.
          If
          you do not agree, please do not use our services.
        </p>

        <Separator class="my-4" />

        <h2 class="text-lg font-semibold mt-4">1. Eligibility</h2>
        <p class="mt-2">To use Milestones, you must be at least 13 years old (or the minimum age required in your
          country).</p>

        <h2 class="text-lg font-semibold mt-4">2. Account Registration</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li>You must provide accurate and complete information when creating your account.</li>
          <li>You are responsible for maintaining the security of your account.</li>
          <li>You may not impersonate others or create an account with false information.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">3. Using Milestones</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li>Explore and add goals from our milestone database or create your own public goals.</li>
          <li>Track your progress by adding milestones and steps.</li>
          <li>Your activity (goal progress, milestones completed, comments, etc.) may be visible to your friends.</li>
          <li>Share your achievements on social media.</li>
          <li>Upload images related to your milestones, as long as they comply with our Content Policy.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">4. User Content & Conduct</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li>You retain ownership of any content you post but grant Milestones a non-exclusive license to use, display,
            and distribute it within the app.</li>
          <li>You may not post content that is illegal, abusive, defamatory, or violates any third-party rights.</li>
          <li>We reserve the right to remove any content that violates these Terms.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">5. Friends & Social Features</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li>Connect with other users, view their progress, and interact with their milestones.</li>
          <li>We may suggest friends based on your activity.</li>
          <li>Manage your privacy settings to control who sees your progress.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">6. Termination</h2>
        <p class="mt-2">We reserve the right to suspend or terminate your account if you violate these Terms. You may
          delete your account at any time through the settings menu.</p>

        <h2 class="text-lg font-semibold mt-4">7. Disclaimers & Limitation of Liability</h2>
        <ul class="list-disc list-inside space-y-2 mt-2">
          <li>Milestones is provided "as is" without warranties of any kind.</li>
          <li>We are not responsible for any personal injury, financial loss, or other damages resulting from your use
            of the app.</li>
          <li>We do not guarantee that achieving goals listed in the app will result in any specific outcome.</li>
        </ul>

        <h2 class="text-lg font-semibold mt-4">8. Changes to These Terms</h2>
        <p class="mt-2">We may update these Terms from time to time. If significant changes are made, we will notify you
          within the app.</p>

        <h2 class="text-lg font-semibold mt-4">9. Contact Us</h2>
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
