import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import parse from "html-react-parser";
import Pagination from "react-js-pagination";
import { Helmet } from "react-helmet";

import { ArticleItem, ArticlePreviewProps } from "../../../interfaces/Article";
import {
  Container,
  DarkSection,
  LoadingText,
  Spinner,
} from "../../core/layout";
import { fadeIn, fadeInUp } from "../../../styles/animations";
import constants from "../../../styles/constants";
import { GetAllPosts } from "../../core/API";
import useFilterArticles from "../../../hooks/useFilterArticles";
import useDebounce from "../../../hooks/useDebounce";

const { colors, whitespace, typography } = constants;

const ArticleListPage: React.FC = () => {
  const [postList, setPostList] = useState<ArticleItem[] | null>(null);
  const [search, setSearch] = useState("");
  const [isFiltering, setFiltering] = useState(false);
  const [isMobile, setMobile] = useState(
    window.matchMedia("(max-width: 420px)").matches
  );
  const [featuredItem, setFeaturedItem] = useState<ArticleItem | null>(null);
  const [activePage, setActivePage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const articleContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filteredArticles] = useFilterArticles(postList, debouncedSearch);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const ITEMS_PER_PAGE = 9;

  const handlePageChange = (pageNum: number) => {
    setActivePage(pageNum);
  };

  useEffect(() => {
    GetAllPosts()
      .then((response: any) => {
        const filteredItems = response.filter(
          (item: ArticleItem) =>
            item.categories.includes(2) || item.categories.includes(3)
        ); // Remove uncategorized posts
        setPostList(
          filteredItems.filter((item: any, index: number) => index !== 0)
        );
        setFeaturedItem(filteredItems[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      setActivePage(1);
    }
    setLoadingSearch(false);
  }, [debouncedSearch]);

  useEffect(() => {
    if (articleContainerRef?.current && isMobile) {
      articleContainerRef?.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line
  }, [activePage]);

  useEffect(() => {
    if (search) {
      setLoadingSearch(true);
    }
  }, [search]);

  useEffect(() => {
    if (isFiltering && searchInputRef && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isFiltering]);

  useEffect(() => {
    const listener = (e: any) => {
      setMobile(e.matches);
    };
    window.matchMedia("(max-width: 420px)").addListener(listener);
    return () =>
      window.matchMedia("(max-width: 420px)").removeListener(listener);
  }, []);

  const pageFilteredList = filteredArticles?.slice(
    activePage * ITEMS_PER_PAGE - ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Helmet>
        <title>Articles - haakon.dev</title>
      </Helmet>
      <ArticleListSection>
        <Container>
          {!postList && (
            <h2>
              <LoadingText />
            </h2>
          )}

          {pageFilteredList && featuredItem !== null && (
            <>
              <FeaturedItem item={featuredItem} />
              <SearchInputContainer>
                {!isFiltering ? (
                  <FilterButtonContainer onClick={() => setFiltering(true)}>
                    Filter
                    <FilterButton
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"
                        clip-rule="evenodd"
                      ></path>
                    </FilterButton>
                  </FilterButtonContainer>
                ) : (
                  <SearchInput
                    type="search"
                    ref={searchInputRef}
                    value={search}
                    onChange={(e: any) => setSearch(e.target.value)}
                    placeholder="Search through articles"
                  />
                )}

                <Spinner active={loadingSearch} />
              </SearchInputContainer>
              <OnlyOnMobile>
                Showing {pageFilteredList.length + " "}
                {pageFilteredList.length === 1 ? "article" : "articles"}.
              </OnlyOnMobile>
              <ArticlesContainer ref={articleContainerRef}>
                {pageFilteredList.map((item, index) => (
                  <ArticlePreview
                    item={item}
                    index={index}
                    key={`article-preview-${index}-${item.id}`}
                  />
                ))}
              </ArticlesContainer>
              {filteredArticles && filteredArticles.length > 0 && (
                <PaginationContainer>
                  <Pagination
                    activePage={activePage}
                    itemsCountPerPage={ITEMS_PER_PAGE}
                    totalItemsCount={
                      filteredArticles ? filteredArticles.length : 0
                    }
                    itemClassFirst="firstItem"
                    itemClassNext="nextItem"
                    itemClassLast="lastItem"
                    itemClassPrev="prevItem"
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                  />
                </PaginationContainer>
              )}
              {filteredArticles &&
                filteredArticles.length <= 0 &&
                `Can't find any articles containing "${debouncedSearch}"...`}
            </>
          )}
        </Container>
      </ArticleListSection>
    </>
  );
};

const FeaturedItem: React.FC<ArticlePreviewProps> = ({ item }) => {
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const history = useHistory();
  useEffect(() => {
    if (item._links["wp:featuredmedia"] && item._links["wp:featuredmedia"][0]) {
      fetch(item._links["wp:featuredmedia"][0].href)
        .then((res) => res.json())
        .then((response: any) => {
          if (response.media_details) {
            setFeaturedImage(response.media_details.sizes.full.source_url);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [item._links]);

  const openArticle = () => history.push(`/article/${item.slug}`);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === " " || key === "Enter") {
      openArticle();
    }
  };

  return (
    <StyledFeaturedItem
      tabIndex={0}
      role="button"
      aria-label={item.title.rendered}
      onClick={openArticle}
      onKeyDown={onKeyDown}
    >
      {featuredImage && <img src={featuredImage} alt="Featured" />}
      <h3>
        <span>{parse(item.title.rendered)}</span>
      </h3>
      {parse(item.excerpt.rendered)}
    </StyledFeaturedItem>
  );
};

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ item, index }) => {
  const history = useHistory();

  const openArticle = () => history.push(`/article/${item.slug}`);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === " " || key === "Enter") {
      openArticle();
    }
  };

  const indexVarStyles = { "--i": index } as React.CSSProperties;

  return (
    <StyledArticle
      onClick={openArticle}
      tabIndex={0}
      role="button"
      onKeyDown={onKeyDown}
      aria-label={item.title.rendered}
      style={indexVarStyles}
    >
      <h3>
        <span>{parse(item.title.rendered)}</span>
      </h3>
      {parse(item.excerpt.rendered)}
    </StyledArticle>
  );
};

const FilterButtonContainer = styled.a`
  margin-left: auto;
  cursor: pointer;
  font-size: ${typography.s};
  position: relative;
  @media screen and (max-width: 420px) {
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-left: 0px;
  }
  &:after {
    transition: 0.2s;
    background: ${colors.lightPink};
    content: "";
    height: 1px;
    position: absolute;
    top: calc(100% + 2px);
    pointer-events: none;
    opacity: 0.5;
    left: 0;
    right: 0;
    transform: scaleX(0);
  }
  &:hover {
    &:after {
      transform: scaleX(1);
    }
  }
`;

const FilterButton = styled.svg`
  transition: 0.2s;
  margin-left: 0.5rem;
  transform: translate(0px, 2px);
  cursor: pointer;
`;

const PaginationContainer = styled.div`
  margin: ${whitespace.l} 0 0;
  .pagination {
    transition: opacity 0.2s ease-in-out;
    display: flex;
    list-style: none;
    padding: 0;
    justify-content: center;
    opacity: 0.4;
    &:hover {
      opacity: 0.8;
    }
    li a {
      padding: ${whitespace.s} ${whitespace.m};
      background: ${colors.primary};
      color: ${colors.gray};
      text-decoration: none;
      border-radius: 2px;
      font-size: ${typography.xs};
    }
    li.active a {
      font-weight: bold;
      background: ${colors.beige};
      color: ${colors.bgDark};
    }
    li.disabled {
      opacity: 0.5;
    }
    .firstItem a,
    .nextItem a,
    .lastItem a,
    .prevItem a {
      background: transparent;
      color: ${colors.white};
    }
    li + li {
      margin-left: ${whitespace.s};
    }
  }
`;

const ArticleListSection = styled(DarkSection)`
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-in-out;
  &:after {
    transition: opacity 0.5s ease-in-out;
    content: "";
    display: block;
    width: 40vmin;
    height: 40vmin;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(#ffffff57 1%, rgba(255, 255, 255, 0) 51%);
    position: absolute;
    left: calc(var(--x) * 1px);
    top: calc(var(--y) * 1px);
    z-index: 0;
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    &:after {
      /* opacity: 0.2; */
    }
  }
`;

const OnlyOnMobile = styled.div`
  display: none;
  font-size: ${typography.xs};
  margin: ${whitespace.m} 0 0;
  text-align: center;
  @media screen and (max-width: 420px) {
    display: block;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin: ${whitespace.m} 0 0;
  display: flex;
  > i {
    position: absolute;
    top: -33px;
    right: ${whitespace.l};
    z-index: 1;
    border-top-color: rgba(255, 255, 255, 0.5);
    border-right-color: rgba(255, 255, 255, 0.5);
    border-bottom-color: rgba(255, 255, 255, 0.5);
    border-left-color: ${colors.primary};
  }
  @media screen and (max-width: 420px) {
    align-items: center;
    justify-content: center;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${whitespace.s};
  border: 1px solid ${colors.primary};
  border-radius: 2px;
  background: ${colors.gray};
  font-family: "IBM Plex Mono", monospace;
  font-size: ${typography.s};
  opacity: 0.7;
  position: relative;
  animation: ${fadeInUp} 0.3s ease-in-out;
  z-index: 1;

  @media screen and (max-width: 420px) {
    font-size: 16px;
  }

  &:focus {
    opacity: 1;
    outline: 5px auto rgba(0, 150, 255, 1);
  }
`;

const StyledFeaturedItem = styled.div`
  margin: ${whitespace.m} 0;
  padding: ${whitespace.m};
  background: ${colors.bgDark};
  animation: ${fadeIn} 0.2s ease-in-out;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  z-index: 1;
  > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: translate(0px, -30%);
    opacity: 0.1;
    pointer-events: none;
  }
  > p,
  > h3 {
    position: relative;
    z-index: 1;
  }
  &:focus {
    outline: 5px auto rgba(0, 150, 255, 1);
  }
  > p {
    font-size: ${typography.s};
    opacity: 0.6;
    background: ${colors.bg}66;
    line-height: 1.5rem;
    padding: ${whitespace.s};
  }
`;

const StyledArticle = styled.div`
  transition: transform 0.2s ease-in-out;
  padding: ${whitespace.m};
  background: ${colors.bgDark};
  position: relative;
  cursor: pointer;
  max-height: 150px;
  overflow: hidden;
  --i: 0;
  animation: ${fadeIn} 0.2s ease-in-out;
  animation-fill-mode: both;
  animation-delay: calc(var(--i) * 50ms);
  opacity: 0;
  z-index: 1;
  h3 {
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > p {
    font-size: ${typography.s};
    opacity: 0.6;
  }
  &:focus {
    outline: 5px auto rgba(0, 150, 255, 1);
  }
  &:hover {
    transform: scale(1.01);
  }
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: linear-gradient(to top, ${colors.bgDark}, rgba(0, 0, 0, 0));
  }
`;

const ArticlesContainer = styled.div`
  margin: ${whitespace.m} 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: ${whitespace.s};
`;

export default ArticleListPage;
