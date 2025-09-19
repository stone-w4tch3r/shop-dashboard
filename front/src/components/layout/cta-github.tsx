import React from 'react';
import { Button } from '@/components/ui/button';
import { IconBrandGithub } from '@tabler/icons-react';

export default function CtaGithub() {
  return (
    <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
      <a
        href='https://github.com/example/dashboard-template'
        rel='noopener noreferrer'
        target='_blank'
        className='dark:text-foreground'
        aria-label='View template repository'
      >
        <IconBrandGithub />
      </a>
    </Button>
  );
}
