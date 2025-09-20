import Link from "next/link";
import Image from "next/image";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";

// TypeScript interfaces
interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableProps {
  data: TableData;
}

interface CustomLinkProps extends React.ComponentProps<"a"> {
  href: string;
  children: React.ReactNode;
}

interface RoundedImageProps extends React.ComponentProps<typeof Image> {
  alt: string;
}

interface ChildrenProps {
  children: React.ReactNode;
}

interface CodeProps extends React.ComponentProps<"code"> {
  children: string;
}

interface PreProps extends React.ComponentProps<"pre"> {
  children: React.ReactNode;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  children: React.ReactNode;
}

function Table({ data }: TableProps) {
  const headers = data.headers.map((header: string, index: number) => (
    <th
      key={index}
      className="border border-gray-300 bg-gray-50 px-2 py-2 text-left text-sm font-semibold text-gray-900 sm:px-4 sm:py-3 sm:text-base dark:border-gray-600 dark:bg-gray-800 dark:text-white"
    >
      {header}
    </th>
  ));
  const rows = data.rows.map((row: string[], index: number) => (
    <tr
      key={index}
      className="transition-colors duration-200 even:bg-gray-50 hover:bg-gray-100 dark:even:bg-gray-800 dark:hover:bg-gray-700"
    >
      {row.map((cell: string, cellIndex: number) => (
        <td
          key={cellIndex}
          className="border border-gray-300 px-2 py-2 text-sm break-words text-gray-700 sm:px-4 sm:py-3 sm:text-base dark:border-gray-600 dark:text-gray-300"
        >
          {cell}
        </td>
      ))}
    </tr>
  ));

  return (
    <div className="mb-6 overflow-x-auto rounded-lg border border-gray-300 shadow-sm dark:border-gray-600">
      <table className="w-full min-w-full border-collapse bg-white dark:bg-gray-900">
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className="rounded-sm text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-2 transition-all duration-300 hover:text-blue-800 hover:decoration-blue-800 hover:decoration-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-blue-400 dark:decoration-blue-400 dark:hover:text-blue-300 dark:hover:decoration-blue-300 dark:focus:ring-blue-400"
      >
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        {...props}
        className="rounded-sm text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-2 transition-all duration-300 hover:text-blue-800 hover:decoration-blue-800 hover:decoration-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-blue-400 dark:decoration-blue-400 dark:hover:text-blue-300 dark:hover:decoration-blue-300 dark:focus:ring-blue-400"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className="inline-flex items-center gap-1 rounded-sm text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-2 transition-all duration-300 hover:gap-1.5 hover:text-blue-800 hover:decoration-blue-800 hover:decoration-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-blue-400 dark:decoration-blue-400 dark:hover:text-blue-300 dark:hover:decoration-blue-300 dark:focus:ring-blue-400"
    >
      {children}
      <svg
        className="h-3 w-3 transition-transform duration-300 hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

function RoundedImage({ alt, ...props }: RoundedImageProps) {
  return (
    <div className="mb-6">
      <Image
        alt={alt}
        className="mx-auto h-auto max-w-full rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
        {...props}
      />
      {alt && (
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-500 italic dark:text-gray-400">
          {alt}
        </p>
      )}
    </div>
  );
}

function StyledParagraph({ children }: ChildrenProps) {
  return (
    <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg sm:leading-relaxed dark:text-gray-300">
      {children}
    </p>
  );
}

function StyledUnorderedList({ children }: ChildrenProps) {
  return (
    <ul className="mb-4 ml-4 list-inside list-disc space-y-2 text-gray-700 sm:ml-6 dark:text-gray-300">
      {children}
    </ul>
  );
}

function StyledOrderedList({ children }: ChildrenProps) {
  return (
    <ol className="mb-4 ml-4 list-inside list-decimal space-y-2 text-gray-700 sm:ml-6 dark:text-gray-300">
      {children}
    </ol>
  );
}

function StyledListItem({ children }: ChildrenProps) {
  return (
    <li className="pl-2 text-base leading-relaxed sm:text-lg sm:leading-relaxed">{children}</li>
  );
}

function Code({ children, ...props }: CodeProps) {
  const codeHTML = highlight(children);
  return (
    <code
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-sm break-words whitespace-pre-wrap text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      {...props}
    />
  );
}

function Pre({ children, ...props }: PreProps) {
  return (
    <pre
      className="mb-6 overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-3 font-mono text-xs leading-relaxed text-gray-100 shadow-lg sm:p-4 sm:text-sm dark:border-gray-600 dark:bg-gray-800"
      {...props}
    >
      <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-700">
        {children}
      </div>
    </pre>
  );
}

function StyledBlockquote({ children }: ChildrenProps) {
  return (
    <blockquote className="mb-6 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 py-4 pr-4 pl-6 text-gray-700 italic shadow-sm transition-colors duration-300 hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-900/20 dark:text-gray-300 dark:hover:bg-blue-900/30">
      <div className="text-base leading-relaxed sm:text-lg sm:leading-relaxed">{children}</div>
    </blockquote>
  );
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: HeadingLevel) {
  const Heading = ({ children }: HeadingProps) => {
    const slug = slugify(children as string);

    // Define mobile-first responsive font sizes and spacing for each heading level
    const headingStyles: Record<HeadingLevel, string> = {
      1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-8 mb-6 leading-tight tracking-tight",
      2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-8 mb-5 leading-tight tracking-tight",
      3: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mt-6 mb-4 leading-snug tracking-tight",
      4: "text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 leading-snug tracking-tight",
      5: "text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mt-5 mb-3 leading-normal tracking-tight",
      6: "text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2 leading-normal tracking-normal",
    };

    return React.createElement(
      `h${level}`,
      { id: slug, className: headingStyles[level] },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className:
            "anchor no-underline hover:underline text-blue-600 dark:text-blue-400 opacity-0 hover:opacity-100 transition-opacity duration-300 ml-2 text-sm hover:text-blue-800 dark:hover:text-blue-300",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: StyledParagraph,
  ul: StyledUnorderedList,
  ol: StyledOrderedList,
  li: StyledListItem,
  blockquote: StyledBlockquote,
  Image: RoundedImage,
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  pre: Pre,
  Table,
};

export function CustomMDX(props: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />;
}
