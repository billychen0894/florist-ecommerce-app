'use client';

import { Dialog, Transition } from '@headlessui/react';
import React, { Dispatch, Fragment, SetStateAction } from 'react';

import { cn } from '@/lib/classNames';
import Button from './Button';

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  svgIcon?: React.ReactElement;
  iconBgColor?: string;
  title: string;
  description?: string;
  buttonText?: string | React.ReactElement;
  buttonAction?: () => void;
  backdropAction?: () => void;
  additionalBtns?: React.ReactElement;
}

export default function Modal({
  open,
  setOpen,
  svgIcon,
  title,
  description,
  buttonText,
  iconBgColor,
  buttonAction,
  backdropAction,
  additionalBtns,
}: ModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30"
        onClose={() => {
          setOpen(false);
          backdropAction && backdropAction();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div
                    className={cn(
                      'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100',
                      iconBgColor
                    )}
                  >
                    {svgIcon}
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <Button
                    type="button"
                    className="inline-flex w-full justify-center px-3 py-2"
                    onClick={() => {
                      setOpen(false);
                      buttonAction && buttonAction();
                    }}
                  >
                    {buttonText}
                  </Button>
                  {additionalBtns}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
