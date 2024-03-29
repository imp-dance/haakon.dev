import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Particles from "react-tsparticles";
import { Helmet } from "react-helmet";
import Toggle from "toggle-hu-react";

import {
  Container,
  DarkSection,
  LightSection,
} from "../../core/layout";
import ExperienceTable from "./experience-table/ExperienceTable";
import ExternalLink from "../../core/links/ExternalLink";
import ToolsShowcase from "./ToolsShowcase";

import { ReactComponent as HeaderSVG } from "../../../assets/svg/vector.svg";
import { ReactComponent as TilesSVG } from "../../../assets/svg/tiles.svg";
import landingPageData from "../../../data/landingPage";
import {
  fadeUpButtons,
  fadeIn,
  heavyFadeIn,
  fadeInUp,
} from "../../../styles/animations";
import constants from "../../../styles/constants";
import particleOptions from "../../../data/particles.json";
import { useHistory } from "react-router";
import { ExperienceSection } from "./experience/Experience";
import { useMediaQuery } from "react-responsive";

const { colors, typography, whitespace } = constants;

const storedShowParticles = localStorage.getItem(
  "hus-show-particles"
);
const initialShowParticles = storedShowParticles
  ? JSON.parse(storedShowParticles)
  : true;

const LandingPage: React.FC = () => {
  const [showParticles, setShowParticles] = useState(
    initialShowParticles
  );
  const showTable = useMediaQuery({
    query: "(max-width: 1100px)",
  });
  const history = useHistory();
  const toggleParticles = () => {
    const newValue = !showParticles;
    localStorage.setItem(
      "hus-show-particles",
      JSON.stringify(newValue)
    );
    setShowParticles(newValue);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, [history.location]);
  return (
    <>
      <Helmet>
        <title>Håkon Underbakke</title>
      </Helmet>
      <LandingPageContainer>
        <IntroSection>
          <Container>
            <IntroTitle>
              {landingPageData.header.title
                .split(" ")
                .map((item, index) => (
                  <i key={`title-letter-${index}`}>{item} </i>
                ))}
            </IntroTitle>
            {landingPageData.header.text}
          </Container>
          <HeaderSVG />
        </IntroSection>
        <InfoSection>
          {showTable ? (
            <ExperienceTable />
          ) : (
            <ExperienceSection />
          )}
          <TilesSVG />
        </InfoSection>
        <DarkSection>
          <ToolsShowcaseContainer>
            <Toggle
              label={
                showParticles
                  ? "Hide particles"
                  : "Show particles"
              }
              checked={showParticles}
              onChange={toggleParticles}
            />
            {showParticles && (
              <Particles
                id="tsParticles"
                options={particleOptions}
              />
            )}
            <InnerContainer>
              <ToolsShowcase />
            </InnerContainer>
          </ToolsShowcaseContainer>
        </DarkSection>
        <InfoSection className="findmeon">
          <Container>
            <LinksAndRefContainer>
              <LinksAndReferences className="linksAndReferences">
                {landingPageData.linksAndReferences.map(
                  (item, index) => (
                    <LinkReference
                      to={item.url}
                      key={`link-reference-${index}`}
                    >
                      <i
                        role="img"
                        aria-label={`Icon for ${item.title}`}
                      >
                        {item.icon}
                      </i>
                      {item.title}{" "}
                      {item.context && (
                        <span>{item.context}</span>
                      )}
                    </LinkReference>
                  )
                )}
              </LinksAndReferences>
              <LinksAndRefBG />
            </LinksAndRefContainer>
          </Container>
        </InfoSection>
        <DarkSection>
          <Container>
            <IntroTitle>🤫 Psst, I also make music</IntroTitle>
            <p>
              You can find my music anywhere as{" "}
              <strong>sl1ck</strong>.
            </p>
            <p>
              <ExternalLink to="https://open.spotify.com/artist/5nieID8LGLw0nMgwbIIsVq?si=gkshKgypQiSbLlz4iILbMQ">
                Spotify
              </ExternalLink>
              ,{" "}
              <ExternalLink to="https://soundcloud.com/sl1ck">
                Soundcloud
              </ExternalLink>
              ,{" "}
              <ExternalLink to="https://www.youtube.com/channel/UCH_FcfP7oNrQXaC2RngA84Q">
                YouTube
              </ExternalLink>
            </p>
          </Container>
        </DarkSection>
      </LandingPageContainer>
    </>
  );
};

const ToolsShowcaseContainer = styled.div`
  #tsParticles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    animation: ${heavyFadeIn} 0.6s ease-in-out;
    will-change: opacity;
    animation-fill-mode: both;
    z-index: -1;
    @media (prefers-reduced-motion) {
      display: none;
    }
  }
  .hu-comp-toggle-label {
    opacity: 0.5;
    position: absolute;
    bottom: ${whitespace.l};
    left: ${whitespace.l};
    font-size: ${typography.s};
    user-select: none;
  }
  .hu-comp-toggle-span {
    width: 3.5em !important;
  }
`;

const LandingPageContainer = styled.div`
  z-index: 1;
  background: ${colors.bg};

  section {
  }
`;

const InnerContainer = styled(Container)`
  > div {
    margin: 0 0 ${whitespace.l};
    // opacity: 0.6;
    // animation: ${fadeIn} 0.2s ease-in-out;
    // will-change: opacity;
    animation-fill-mode: both;
    animation-delay: 2.3s;
    &:last-child {
      margin: none;
    }
  }
`;

const IntroSection = styled(DarkSection)`
  p {
    animation: ${fadeIn} 0.2s ease-in-out;
    will-change: opacity;
    animation-fill-mode: both;
    animation-delay: 1.5s;
  }
  p,
  h2 {
    position: relative;
    z-index: 1;
    background: ${colors.bg};
  }
  h2 {
    display: inline-block;
  }
  > svg {
    position: absolute;
    top: 0;
    width: 100vw;
    right: 0;
    transform: translate(0px, 50%) rotate(80deg);
    z-index: 0;
    pointer-events: none;
    user-select: none;
  }
  #headerPath {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 2s cubic-bezier(0.29, 0.74, 0.8, 0.34)
      forwards;
    will-change: stroke-dashoffset;
    animation-fill-mode: both;
    animation-delay: 1s;
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
`;

const InfoSection = styled(LightSection)`
  animation: ${fadeInUp} 0.4s ease-in-out;
  position: relative;
  overflow: hidden;
  .accordion-container,
  .linksAndReferences {
    //animation: ${fadeIn} 0.2s ease-in-out;
    //will-change: opacity;
    animation-fill-mode: both;
    animation-delay: 2.4s;
  }
  &.findmeon {
    background: linear-gradient(to top left, #171727, #252454);
    border-top: 1rem solid #252453;
    min-height: 50vh;
    max-height: 800px;
  }
  > svg {
    position: absolute;
    bottom: -30px;
    z-index: 1;
    left: -50px;
    height: 100%;
    transform: translateY(50%) rotate(-7deg);
    opacity: 0.4;
    pointer-events: none;
    user-select: none;
  }
  > div {
    position: relative;
    z-index: 2;
  }
`;

const IntroTitle = styled.h2`
  font-size: ${typography.xl};
  > i {
    font-style: normal;
    animation: ${fadeUpButtons} 0.4s ease-in-out;
    animation-fill-mode: both;
    will-change: opacity, transform;
    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.6s;
    }
    &:nth-child(3) {
      animation-delay: 0.7s;
    }
    &:nth-child(4) {
      animation-delay: 0.8s;
    }
    &:nth-child(5) {
      animation-delay: 1s;
    }
    &:nth-child(6) {
      animation-delay: 1.1s;
    }
  }
`;

const LinksAndRefBGAnimation = keyframes`
  from {
    transform:translate(0px, 0px);
    opacity:0;
  }
  to{
    transform:translate(10px, 10px);
    opacity:1;
  }
`;

const LinksAndRefContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const LinksAndRefBG = styled.div`
  position: absolute;
  background: ${colors.bg};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.7;
  animation: ${LinksAndRefBGAnimation} 0.6s ease-in-out;
  will-change: opacity;
  animation-fill-mode: both;
  // animation-delay: 2.4s;
`;

const LinksAndReferences = styled.div`
  content-visibility: auto;
  background: ${colors.bgDark};
  color: ${colors.beige};
  padding: ${whitespace.m};
  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

const LinkReference = styled(ExternalLink)`
  display: flex;
  align-items: center;
  padding: ${whitespace.s};
  background: ${colors.bg};
  color: ${colors.white};
  margin: 0 0 ${whitespace.s};
  text-decoration: none;
  position: relative;
  transition: all 0.2s;
  i {
    transition: all 0.1s ease-in-out;
    display: inline-block;
    width: 20px;
    margin-right: ${whitespace.s};
    transform: translate(-1px, 4px) rotate(-20deg);
    position: absolute;
    left: ${whitespace.s};
    opacity: 0;
  }
  span {
    margin-left: auto;
    font-size: ${typography.s};
    opacity: 0.7;
    text-align: right;
  }
  &:hover,
  &:focus {
    padding-left: ${whitespace.l};
    outline: none;
    @media (prefers-reduced-motion) {
      padding-left: ${whitespace.s};
      background: ${colors.bg};
      color: ${colors.beige};
    }
    i {
      transform: translate(1px, 2px);
      transition-duration: 0.5s;
      opacity: 1;
    }
    &::before {
      transform: scaleX(1);
      opacity: 1;
      @media (prefers-reduced-motion) {
        opacity: 0;
      }
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    will-change: transform, opacity;
    opacity: 0;
    transform-origin: left;
    transition: transform 0.3s ease-in-out,
      opacity 0.4s ease-in-out;
    transform: scaleX(0);
    border-bottom: 2px solid;
    border-image: linear-gradient(
      150deg,
      rgb(177, 92, 92),
      rgb(116, 110, 195)
    );
    border-image-slice: 1;
  }
`;

export default LandingPage;
