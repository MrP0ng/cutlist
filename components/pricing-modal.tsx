'use client'

import { Check, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const handleUpgrade = (priceId: string) => {
    // TODO: Implement Stripe checkout flow
    console.log('Upgrade to:', priceId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Unlock unlimited projects, sheets, and parts with our Pro passes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Free Tier */}
          <div className="border rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Free</h3>
              <div className="text-3xl font-bold mt-2">$0</div>
              <div className="text-muted-foreground">Forever</div>
            </div>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 5 projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 5 sheets per project</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 50 parts per project</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm">No PDF export</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full mt-6" disabled>
              Current Plan
            </Button>
          </div>

          {/* 7-Day Pass */}
          <div className="border rounded-lg p-6 relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              Most Popular
            </Badge>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold">7-Day Pass</h3>
              <div className="text-3xl font-bold mt-2">$9.99</div>
              <div className="text-muted-foreground">7 days</div>
            </div>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited sheets</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited parts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">PDF export</span>
              </li>
            </ul>

            <Button 
              onClick={() => handleUpgrade('7day-pass')}
              className="w-full mt-6"
            >
              Get 7-Day Pass
            </Button>
          </div>

          {/* 30-Day Pass */}
          <div className="border rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">30-Day Pass</h3>
              <div className="text-3xl font-bold mt-2">$19.99</div>
              <div className="text-muted-foreground">30 days</div>
              <div className="text-xs text-green-600 mt-1">Save 33%</div>
            </div>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited sheets</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited parts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">PDF export</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>

            <Button 
              onClick={() => handleUpgrade('30day-pass')}
              variant="outline"
              className="w-full mt-6"
            >
              Get 30-Day Pass
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-6">
          All purchases are one-time payments. No recurring subscriptions.
        </div>
      </DialogContent>
    </Dialog>
  )
}
