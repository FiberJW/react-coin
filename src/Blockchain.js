// @flow
import React, { Component } from "react";
import sha256 from "sha.js";
import moment from "moment";
import styled from "styled-components";

class Block {
  index: number;
  timestamp: string;
  data: string;
  prevHash: string;
  hash: string;

  static genesis() {
    return new Block(
      0,
      "Genesis Block",
      sha256("sha256")
        .update("0")
        .digest("hex")
    );
  }

  constructor(index: number, data: string, prevHash: string) {
    this.index = index;
    this.timestamp = moment.utc().toString();
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.generateHash();
  }

  generateHash(): string {
    return sha256("sha256")
      .update(
        this.index.toString() + this.timestamp + this.data + this.prevHash
      )
      .digest("hex");
  }
}

type State = {
  chain: Array<Block>,
};

class Blockchain extends Component<void, State> {
  state = {
    chain: [Block.genesis()],
  };

  componentDidMount() {
    setInterval(() => {
      this.setState(prevState => {
        const { index, hash } = prevState.chain[prevState.chain.length - 1];

        return {
          ...prevState,
          chain: [
            ...prevState.chain,
            new Block(
              index + 1,
              `Your browser just mined block ${index + 1}.`,
              hash
            ),
          ],
        };
      });

      window.scrollTo(0, document.body.scrollHeight);
    }, 2000);
  }

  render() {
    return (
      <CenteredColumn>
        {this.state.chain.map(
          b =>
            b.index >= 1 ? (
              <CenteredColumn key={b.index}>
                <img
                  src={require("./assets/images/link.svg")}
                  height={24}
                  width={24}
                  alt="Link Icon"
                />
                <BlockContainer>
                  <pre>
                    <code>{JSON.stringify(b, null, 2)}</code>
                  </pre>
                </BlockContainer>
              </CenteredColumn>
            ) : (
              <BlockContainer key={b.index}>
                <pre>
                  <code>{JSON.stringify(b, null, 2)}</code>
                </pre>
              </BlockContainer>
            )
        )}
      </CenteredColumn>
    );
  }
}

const CenteredColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const BlockContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: #333;
  border: 2px solid #333;
  margin: 1rem 0.5rem;
  border-radius: 0.25rem;
  padding: 0.25rem;
`;

export default Blockchain;
