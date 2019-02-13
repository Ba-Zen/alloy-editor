import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import React, { Component } from 'react';

import Sidebar from '../components/Sidebar';
import LayoutNav from '../components/LayoutNav';
import CodeTabs from '../components/CodeTabs';
import CodeClipboard from '../components/CodeClipboard';
import Auth from '../components/Auth';
import Footer from '../components/Footer';

export default class Docs extends Component {
    constructor(props) {
        super(props);
        this.state = {
			navbarToggled: false,
		}
    }

    componentDidMount() {
        this._codeTabs = new CodeTabs();
        this._codeClipboard = new CodeClipboard();
    }

    componentWillUnmount() {
        this._codeTabs = null;
        this._codeClipboard.dispose();
    }

    docsNavbarToggleClick() {
        this.setState(prevState => ({
            navbarToggled: !prevState.navbarToggled
        }));
    }

    render() {
        const { data, location } = this.props;

        const { mdx: { code, frontmatter: {title, needsAuth}, excerpt, timeToRead } } = data;

        return (
            <Auth needsAuth={needsAuth}>
                <div className="docs">
                    <Helmet>
                        <title>{title}</title>
                        <meta name="description" content={excerpt} />
                        <meta name="og:description" content={excerpt} />
                        <meta name="twitter:description" content={excerpt} />
                        <meta name="og:title" content={title} />
                        <meta name="og:type" content="article" />
                        <meta name="twitter.label1" content="Reading time" />
                        <meta
                            name="twitter:data1"
                            content={`${timeToRead} min read`}
                        />
                    </Helmet>

                    <main className="content">
                        <header>
                            <LayoutNav effect={true} static={true} sidebarHamburguerIcon={true} onNavbarToggleClick={this.docsNavbarToggleClick.bind(this)} />
                        </header>

                        <section>
                            <Sidebar location={location} navbarToggled={this.state.navbarToggled} />

                            <div className="sidebar-offset pt-header">
                                <div className="py-5 bg-dark text-white">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h1 className="text-center my-5">{title}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-4 p-sm-5 min-vh-100">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12 col-xl-8 mx-auto">
                                                <article className="docs-content">
                                                    <MDXRenderer>{code.body}</MDXRenderer>
                                                </article>

                                                {/* <a className="btn btn-dark btn-lg" href={"https://github.com/"+site.githubRepo+"/tree/master/"+page.srcFilePath} target="_blank"> */}
                                                {/* <a className="btn btn-dark btn-sm float-right mt-5" href="#" target="_blank" title="Edit this section on GitHub">
                                                    <img className="align-middle" src="/images/home/GitHub-Mark-64px.svg" alt="" />
                                                    <span className="align-middle ml-3">Edit</span>
                                                </a> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Footer />
                            </div>
                        </section>
                    </main>
                </div>
            </Auth>
        );
    }
}

export const pageQuery = graphql`
    query($slug: String!) {
        mdx(fields: { slug: { eq: $slug } }) {
            excerpt
            timeToRead
            frontmatter {
                title
                needsAuth
            }
            code {
                body
            }
        }
    }
`;