# ParetoTracker

This is the code repository for the IEEE VIS 2024 paper "ParetoTracker: Understanding Population Dynamics in Multi-objective Evolutionary Algorithms through Visual Analytics".

Paper link: [`Arxiv Link`](https://arxiv.org/abs/2408.04539)

## Introduction

Multi-objective evolutionary algorithms (MOEAs) have emerged as powerful tools for solving complex optimization problems characterized by multiple, often conflicting, objectives. While advancements have been made in computational efficiency as well as diversity and convergence of solutions, a critical challenge persists: the internal evolutionary mechanisms are opaque to human users. Drawing upon the successes of explainable AI in explaining complex algorithms and models, we argue that the need to understand the underlying evolutionary operators and population dynamics within MOEAs aligns well with a visual analytics paradigm. This paper introduces ParetoTracker, a visual analytics framework designed to support the comprehension and inspection of population dynamics in the evolutionary processes of MOEAs. Informed by preliminary literature review and expert interviews, the framework establishes a multi-level analysis scheme, which caters to user engagement and exploration ranging from examining overall trends in performance metrics to conducting fine-grained inspections of evolutionary operations. In contrast to conventional practices that require manual plotting of solutions for each generation, ParetoTracker facilitates the examination of temporal trends and dynamics across consecutive generations in an integrated visual interface. The effectiveness of the framework is demonstrated through case studies and expert interviews focused on widely adopted benchmark optimization problems.

## Getting Started

Please download the code as zip or clone the repository, and then navigate to the directory. (Make sure you have `node.js` and `npm` installed on your device! )

For deploying the platform:

```bash
npm install
npm run dev
```

## Citation

If you use or mention this work in your research, please consider the following BibTeX entry:

```
@ARTICLE{Zhang2024ParetoTracker,
  author={Zhang, Zherui and Yang, Fan and Cheng, Ran and Ma, Yuxin},
  journal={IEEE Transactions on Visualization and Computer Graphics},
  title={ParetoTracker: Understanding Population Dynamics in Multi-objective Evolutionary Algorithms through Visual Analytics},
  url = {https://ieeexplore.ieee.org/document/10670520},
  year={2024},
  volume={},
  number={},
  pages={1-11},
  doi={10.1109/TVCG.2024.3456142}
}
```
