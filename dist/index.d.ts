import { Token, MediaLevel, TezosAddress } from '@akaswap/core';
import * as react from 'react';
import react__default from 'react';

type TokenRendererProps = {
    token: Token;
    level?: MediaLevel;
    gateway: string;
    viewer?: TezosAddress | "";
    isPreview?: boolean;
    htmlPreviewUrl?: string;
};
type HeaderTheme = {
    height: number;
    bgColor: string;
    textColor: string;
    buttonBorderColor: string;
};
type HeaderLinkProps = {
    name: string;
    url: string;
    requiresLogin?: boolean;
};
type HeaderProps = {
    logo: React.ReactNode;
    logoUrl: string;
    theme?: HeaderTheme;
    customClass?: string;
    links: HeaderLinkProps[];
    loginMethod?: "google" | "wallet" | "both";
    connectLabel?: string;
    disconnectLabel?: string;
    identifier?: "google" | "wallet";
};
type GoogleLoginProps = {
    connectLabel: string;
    disconnectLabel: string;
    headerTheme?: HeaderTheme;
    onConnect?: () => void;
    onDisconnect?: () => void;
};
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<React.AllHTMLAttributes<Partial<globalThis.HTMLElementTagNameMap["model-viewer"]>>, Partial<globalThis.HTMLElementTagNameMap["model-viewer"]>>;
        }
    }
}

declare const TokenRenderer: ({ token, level, gateway, viewer, isPreview, htmlPreviewUrl }: TokenRendererProps) => react.JSX.Element;

declare const Header: (props: HeaderProps) => react__default.JSX.Element;

declare const GoogleLogin: (props: GoogleLoginProps) => react.JSX.Element;

export { GoogleLogin, type GoogleLoginProps, Header, type HeaderLinkProps, type HeaderProps, type HeaderTheme, TokenRenderer, type TokenRendererProps };
