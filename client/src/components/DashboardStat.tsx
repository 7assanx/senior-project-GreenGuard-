import { ReactNode } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

type DashboardStatProps = {
  title: string;
  value: string | number;
  icon: string;
  linkText?: string;
  linkHref?: string;
  color?: string;
};

export default function DashboardStat({
  title,
  value,
  icon,
  linkText,
  linkHref,
  color = "text-primary",
}: DashboardStatProps) {
  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <i className={`${icon} ${color} text-3xl`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-neutral-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {linkText && linkHref && (
        <div className="bg-neutral-50 px-5 py-3">
          <div className="text-sm">
            <a
              href={linkHref}
              download={linkHref.includes('/download')}
              target={linkHref.includes('/download') ? "_blank" : "_self"}
              className="font-medium text-primary hover:text-primary-dark cursor-pointer"
            >
              {linkText}
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
