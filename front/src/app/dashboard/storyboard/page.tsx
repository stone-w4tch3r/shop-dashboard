'use client';

import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Icon components organized by categories from Figma
const statusIcons = ['billing'] as const; // Using billing as coins/status icon
const graphsIcons = ['dashboard'] as const; // Dashboard represents graphs
const alertsIcons = ['warning'] as const;
const optionsIcons = ['settings'] as const;
const aboutIcons = ['help'] as const;
const burgerIcons = ['ellipsis'] as const; // Using ellipsis as burger menu

// Button component variations - matching Figma "Button" component set
const buttonShowcase = [
  {
    icon: 'billing' as keyof typeof Icons,
    label: 'Device Status',
    variant: 'figma-primary' as const,
    iconColor: 'text-[#8C8C8E]',
    size: 'default' as const
  },
  {
    icon: 'billing' as keyof typeof Icons,
    label: 'Device Status',
    variant: 'figma-secondary' as const,
    iconColor: 'text-[#3C88ED]',
    size: 'default' as const
  },
  {
    icon: 'billing' as keyof typeof Icons,
    label: 'Device Status',
    variant: 'figma-selected' as const,
    iconColor: 'text-[#FEFEFE]',
    size: 'default' as const
  }
];

// Burger Menu button variations - matching Figma "Button burger" component set
const burgerButtonShowcase = [
  {
    icon: 'ellipsis' as keyof typeof Icons,
    label: 'Close Menu',
    variant: 'figma-primary' as const,
    iconColor: 'text-[#8C8C8E]'
  },
  {
    icon: 'ellipsis' as keyof typeof Icons,
    label: 'Close Menu',
    variant: 'figma-secondary' as const,
    iconColor: 'text-[#3C88ED]'
  },
  {
    icon: 'ellipsis' as keyof typeof Icons,
    label: 'Close Menu',
    variant: 'figma-selected' as const,
    iconColor: 'text-[#FEFEFE]'
  }
];

// Menu items - matching Figma "Menu" component set
const menuItems = [
  { label: 'Remote Control', variant: 'figma-primary' as const },
  { label: 'Remote Control', variant: 'figma-gradient' as const },
  { label: 'Remote Control', variant: 'figma-selected' as const }
];

// Form components - matching Figma form elements
const checkboxShowcase = [
  { id: 'storyboard-checkbox-off', label: 'Text', defaultChecked: false },
  { id: 'storyboard-checkbox-on', label: 'Text', defaultChecked: true }
];

const checkboxWithoutTextShowcase = [
  { id: 'storyboard-checkbox-no-text-off', defaultChecked: false },
  { id: 'storyboard-checkbox-no-text-on', defaultChecked: true }
];

const switchShowcase = [
  { id: 'toggle-off', label: 'Toggle Off', defaultChecked: false },
  { id: 'toggle-on', label: 'Toggle On', defaultChecked: true }
];

export default function StoryboardPage() {
  return (
    <PageContainer>
      <div className='flex w-full flex-col gap-8'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>
            UI Component Storyboard
          </h1>
          <p className='text-muted-foreground max-w-2xl'>
            Visual reference for dashboard components arranged to match the
            Figma design system. Components are organized by type: Buttons,
            Icons, Menus, and Form elements.
          </p>
        </header>

        <div className='flex flex-col gap-8'>
          {/* Icon Component Set - organized by categories */}
          <section className='space-y-4'>
            <h2 className='text-xl font-semibold'>Icon Component Set</h2>
            <div className='border-muted-foreground/40 rounded-xl border border-dashed p-6'>
              <div className='grid grid-cols-6 gap-6 lg:grid-cols-8'>
                {[
                  ...statusIcons,
                  ...graphsIcons,
                  ...alertsIcons,
                  ...optionsIcons,
                  ...aboutIcons,
                  ...burgerIcons
                ].map((iconKey) => {
                  const IconComponent = Icons[iconKey];
                  return (
                    <div
                      key={iconKey}
                      className='bg-card flex h-16 w-16 items-center justify-center rounded-lg border shadow-sm'
                    >
                      <IconComponent className='text-muted-foreground size-6' />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Button Component Set - matching Figma layouts */}
          <section className='grid gap-6 lg:grid-cols-2'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Button Component Set</h3>
              <div className='border-muted-foreground/40 rounded-xl border border-dashed p-6'>
                <div className='flex flex-col gap-4'>
                  {buttonShowcase.map((item, index) => {
                    const IconComponent = Icons[item.icon];
                    return (
                      <Button
                        key={`${item.variant}-${index}`}
                        variant={item.variant}
                        className='justify-start gap-3'
                        size='lg'
                      >
                        <IconComponent className={`size-4 ${item.iconColor}`} />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>
                Button Burger Component Set
              </h3>
              <div className='border-muted-foreground/40 rounded-xl border border-dashed p-6'>
                <div className='flex flex-col gap-4'>
                  {burgerButtonShowcase.map((item, index) => {
                    const IconComponent = Icons[item.icon];
                    return (
                      <Button
                        key={`burger-${item.variant}-${index}`}
                        variant={item.variant}
                        className='justify-start gap-3'
                        size='lg'
                      >
                        <IconComponent className={`size-4 ${item.iconColor}`} />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Menu and Form Component Sets */}
          <section className='grid gap-6 lg:grid-cols-3'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Menu Component Set</h3>
              <div className='border-muted-foreground/40 rounded-xl border border-dashed p-6'>
                <div className='flex flex-col gap-3'>
                  {menuItems.map((button, index) => (
                    <Button
                      key={`menu-${index}`}
                      variant={button.variant}
                      size='lg'
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Checkbox Components</h3>
              <div className='border-muted-foreground/40 rounded-xl border border-dashed p-6'>
                <div className='space-y-6'>
                  {/* Checkboxes with text */}
                  <div className='space-y-2'>
                    <h4 className='text-muted-foreground text-sm font-medium'>
                      With Text
                    </h4>
                    <div className='grid gap-4'>
                      {checkboxShowcase.map(({ id, label, defaultChecked }) => (
                        <label
                          key={id}
                          htmlFor={id}
                          className='flex items-center gap-3 text-base'
                        >
                          <Checkbox id={id} defaultChecked={defaultChecked} />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes without text */}
                  <div className='space-y-2'>
                    <h4 className='text-muted-foreground text-sm font-medium'>
                      Without Text
                    </h4>
                    <div className='flex gap-4'>
                      {checkboxWithoutTextShowcase.map(
                        ({ id, defaultChecked }) => (
                          <Checkbox
                            key={id}
                            id={id}
                            defaultChecked={defaultChecked}
                            className='size-6'
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Switch Components</h3>
              <div className='border-muted-foreground/40 rounded-xl border border-dashed p-6'>
                <div className='flex flex-col gap-4'>
                  <Button variant='secondary'>Text</Button>
                  <div className='space-y-3'>
                    {switchShowcase.map(({ id, label, defaultChecked }) => (
                      <div key={id} className='flex items-center gap-3'>
                        <Switch id={id} defaultChecked={defaultChecked} />
                        <Label htmlFor={id}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
